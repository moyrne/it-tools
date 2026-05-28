## ADDED Requirements

### Requirement: Server starts by embedding PocketBase
The system SHALL start an HTTP server by embedding PocketBase in Go code using `github.com/pocketbase/pocketbase` and `github.com/pocketbase/pocketbase/apis`.

#### Scenario: Embedded server starts and listens
- **WHEN** running `go run ./cmd/server` or the compiled binary
- **THEN** PocketBase SHALL start and listen on the configured port (default 8080)

#### Scenario: Server responds to health check
- **WHEN** sending GET request to `/api/health`
- **THEN** PocketBase SHALL return HTTP 200 with status information

### Requirement: Custom hooks load on startup
The system SHALL register PocketBase hooks (`OnBeforeServe()`) to inject server startup logic and on-request hooks.

#### Scenario: OnBeforeServe hook fires
- **WHEN** PocketBase starts
- **THEN** the registered `OnBeforeServe` hook SHALL execute before the server begins listening

### Requirement: Admin UI is accessible
The system SHALL expose PocketBase Admin UI at the `/_/` path.

#### Scenario: Admin UI loads
- **WHEN** accessing `GET /_/` in a browser
- **THEN** PocketBase Admin UI SHALL be served

### Requirement: Environment-based configuration
The system SHALL configure PocketBase via environment variables (PB_PORT, PB_DATA_DIR, PB_ENCRYPTION_KEY, etc.).

#### Scenario: Port configured via environment
- **WHEN** `PB_PORT` environment variable is set to `9090`
- **THEN** PocketBase SHALL listen on port 9090 instead of default

### Requirement: Frontend API adapter
The system SHALL provide a frontend adapter layer that wraps PocketBase JS SDK calls into the existing service interfaces (`@/services/auth`, `@/services/favorites`, `@/services/preferences`).

#### Scenario: Auth service uses PocketBase
- **WHEN** user logs in via `authService.login()`
- **THEN** the adapter SHALL call `pb.collection('users').authWithPassword()` and return access/refresh tokens
