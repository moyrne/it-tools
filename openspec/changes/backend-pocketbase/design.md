## Context

当前 `backend/` 使用自建 Go HTTP 服务（chi + sqlx + JWT + bcrypt + Viper）提供 REST API，包含用户注册登录、收藏管理、偏好设置三个功能域。代码量约 40 个文件，涵盖 handler / service / repository / model / middleware / auth / config 等分层。

PocketBase 是一个 Go 嵌入式后端框架，内置 SQLite、REST API、用户认证（含 OAuth2）、文件存储、Admin UI、实时订阅等功能。将其嵌入本项目后，原本自建的认证、CRUD、配置等模块可全由 PocketBase 替代。

## Goals / Non-Goals

**Goals:**
- 用 PocketBase 替换全部自定义后端代码
- 保留现有 API 语义（收藏、偏好功能等价）
- 前端改动最小化（通过适配层桥接 PocketBase API）
- 完善 Go 嵌入式启动方式（`main.go` + hooks + migrations）

**Non-Goals:**
- 不引入 OAuth2 登录（当前仅 username/password，后续可加）
- 不迁移已有用户数据（数据库从零重建）
- 不引入实时订阅功能（PocketBase 的实时能力仅保留，暂不使用）
- 不改变前端 UI

## Decisions

### 决策1：嵌入模式 vs 独立 PocketBase 进程

| 方案 | 说明 |
|------|------|
| **嵌入式（选）** | 在 `cmd/server/main.go` 中 `import pocketbase`，通过 Go 启动 |
| 独立进程 | 下载 PocketBase 二进制独立运行，本项目仅做配置 |

**理由**：嵌入式与当前启动方式一致（`go run ./cmd/server`），Go 依赖管理统一，便于在 hooks 中插入自定义逻辑（如数据校验、权限增强）。若后续需要解耦，迁移到独立进程代价也很低。

### 决策2：PocketBase Collections 设计（替代 SQLite 表）

| 当前表 | PocketBase Collection | 说明 |
|--------|----------------------|------|
| `users` | `users`（PocketBase 内置） | 自动拥有 auth 能力，字段 password_hash 由系统管理 |
| `favorites` | `favorites` | 自定义 collection，关联 user_id |
| `preferences` | `preferences` | 自定义 collection，关联 user_id |
| `refresh_tokens` | 无需 | PocketBase 内置 token 管理 |

**理由**：PocketBase 的 `users` 内置 collection 已有 username/password/token 管理，无需自建 refresh_tokens 表。自定义 collection 通过 PocketBase 迁移器以代码定义，确保可重复。

### 决策3：前端 API 适配策略

**方案**：在 `src/` 中封装 `pocketbaseService.ts` 适配层，统一 PocketBase JS SDK 调用，保持现有前端 service 层接口不变。

**理由**：前端现有代码调用 `@/services/xxx` 接口。修改最小化的方式是对齐底层实现，不改动调用方。PocketBase 提供 `pocketbase-es` SDK，支持类型化 collection 操作。

### 决策4：速率限制

PocketBase 内置基础的速率限制（基于 IP），支持通过 `config` 环境变量配置。不再需要自建内存限流器。自定义规则（如登录频率限制）可通过 PocketBase hooks 实现。

### 决策5：配置方式

PocketBase 使用环境变量配置（`PB_PORT`、`PB_DATA_DIR` 等），不再需要 Viper + config.yaml。保留 `config.yaml` 仅供参考，实际配置通过 `.env` 或 docker-compose 环境变量传入。

## Migration Plan

1. **准备**：梳理所有现有 API 端点及其对应 PocketBase 等价功能
2. **后端改造**：
   - 创建 `cmd/server/main.go` 嵌入 PocketBase
   - 编写 migrations 定义 `favorites` 和 `preferences` collections
   - 实现钩子（hooks）确保收藏和偏好的层级规则
3. **前端适配**：封装 PocketBase SDK 适配层，替换原 `@/services/` 实现
4. **构建与部署**：更新 Makefile、Dockerfile
5. **验证**：手动测试全部 API 端点和前端功能

**回滚**：git revert 相关 commit，恢复原 `backend/` 代码即可。

## Risks / Trade-offs

- [迁移复杂度] 当前收藏/偏好接口是自定义 REST 风格 → PocketBase 标准 API 可能需要前端适配层包装 → **Mitigation**: 封装适配层隔离差异
- [认证断档] PocketBase auth API 返回格式与现有不同（token 字段名、刷新方式）→ **Mitigation**: 适配层处理格式转换
- [功能缺失] 当前自定义速率限制的特定规则可能无法直接映射 → **Mitigation**: 使用 PocketBase hooks 自定义规则
- [Admin UI 暴露] PocketBase Admin UI 默认在 `/_/` 公开 → **Mitigation**: 生产环境通过反向代理限制访问
