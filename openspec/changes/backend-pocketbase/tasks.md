## 1. 后端：嵌入式 PocketBase 服务

- [x] 1.1 在 `backend/` 中添加 `github.com/pocketbase/pocketbase` 依赖
- [x] 1.2 重写 `backend/cmd/server/main.go`：创建 PocketBase 实例并启动
- [x] 1.3 配置 PocketBase 通过环境变量（端口、数据目录、加密密钥）
- [x] 1.4 编写 migrations 创建 `favorites` collection（user 关联 + tool_path）
- [x] 1.5 编写 migrations 创建 `preferences` collection（user 关联 + key/value）
- [x] 1.6 为 favorites 和 preferences 配置 API 规则（仅 owner 可读写）
- [x] 1.7 清理旧的 `backend/internal/`、`backend/config.yaml` 及不再使用的依赖

## 2. 构建与部署配置

- [x] 2.1 更新 `backend/Makefile`：dev/build/run/test 目标适配 PocketBase
- [x] 2.2 更新 `backend/Dockerfile`：多阶段构建 PocketBase 嵌入式服务
- [x] 2.3 更新 `backend/.env.example`：PocketBase 环境变量模板
- [x] 2.4 清理 `backend/go.mod`：移除 chi、sqlx、jwt、viper 等废弃依赖

## 3. 前端：PocketBase SDK 适配层

- [x] 3.1 安装 `pocketbase` npm 包（或 `pocketbase-es`）
- [x] 3.2 创建 `src/services/pocketbase.ts`：初始化 PocketBase 客户端实例
- [x] 3.3 重写 `src/services/auth.ts`：使用 `pb.collection('users').authWithPassword()` 等 API
- [x] 3.4 重写 `src/services/favorites.ts`：使用 PocketBase collection API
- [x] 3.5 重写 `src/services/preferences.ts`：使用 PocketBase collection API
- [x] 3.6 更新前端 token 存储/刷新逻辑以匹配 PocketBase auth 响应格式
- [x] 3.7 移除不再使用的前端 service 辅助代码

## 4. 验证

- [x] 4.1 启动服务验证 Admin UI（`/_/`）可访问
- [x] 4.2 验证用户注册/登录/刷新/获取信息全流程
- [x] 4.3 验证收藏（增删改查/合并）功能正常
- [x] 4.4 验证偏好（获取/替换/部分更新）功能正常
- [x] 4.5 验证前端页面与后端交互无报错
- [x] 4.6 验证 Docker 构建和启动
