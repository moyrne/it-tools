## Why

当前后端基于 go-chi + sqlx + JWT 自建，实现了用户认证、收藏、偏好等基础功能。但这些功能都是通用的 CRUD + 认证场景，PocketBase 作为开箱即用的 Go 后端框架，原生提供管理后台、REST API、用户认证、文件存储、实时订阅等功能。迁移到 PocketBase 可以消除大量重复代码，降低维护成本，同时获得更完善的管理能力和可扩展性。

## What Changes

- **移除** `backend/cmd/`、`backend/internal/` 中全部自定义 Go 代码（handler/service/repository/model/middleware/auth/config）
- **新建** `backend/cmd/server/main.go` 嵌入 PocketBase 实例
- **新建** PocketBase 迁移文件（`backend/migrations/`），定义 collections：users（已有）、favorites、preferences
- **修改** 前端 API 调用层，适配 PocketBase 的 REST API 风格（`pb.collection().*` SDK 或标准 HTTP）
- **更新** `backend/Dockerfile` 使用 PocketBase 方式构建
- **更新** `backend/Makefile` 提供 dev/build/run 目标
- **更新** `docker-compose.yml`（如需要）
- **保留** `backend/config.yaml` 配置结构（仅示意，PocketBase 使用环境变量配置）
- **移除** 不再需要的 Go 依赖（chi, sqlx, jwt, bcrypt, viper 等）

## Capabilities

### New Capabilities
- `pocketbase-embed`: 在 Go main 中嵌入并配置 PocketBase，启动 HTTP 服务
- `data-migration`: 用 PocketBase 迁移器定义 collections（users, favorites, preferences）和初始数据

### Modified Capabilities
<!-- 目前 openspec/specs/ 为空，无已有 spec 需要修改 -->

## Impact

- **代码**: `backend/` 目录从 ~40 个 Go 文件缩减为核心嵌入 + 迁移文件，预计 -90% 代码量
- **API**: 前端 API 调用从自定义端点切换为 PocketBase REST API（路径/响应格式变化）
- **认证**: 从自建 JWT 切换为 PocketBase 内置 auth（仍返回 token，但刷新/注册流程有差异）
- **数据库**: SQLite 表结构从自定义 migrations SQL 变为 PocketBase collections schema
- **依赖**: 移除 chi/sqlx/jwt/bcrypt/viper，新增 pocketbase 及其依赖
- **运维**: 获得 PocketBase Admin UI（`/_/` 路径），支持在线管理数据
