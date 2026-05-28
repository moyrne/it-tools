## ADDED Requirements

### Requirement: Favorites collection exists
The system SHALL define a `favorites` collection in PocketBase via migration code, with fields: `user` (relation to users), `tool_path` (text, required). A unique constraint SHALL exist on the combination of `user` + `tool_path`.

#### Scenario: Favorites collection is created on first run
- **WHEN** PocketBase server starts for the first time
- **THEN** a `favorites` collection SHALL be created automatically via migration

#### Scenario: Favorite is stored
- **WHEN** a user creates a favorite with a tool_path via PocketBase API
- **THEN** the record SHALL be stored with `user` relation and `tool_path` value
- **AND** a duplicate `user` + `tool_path` combination SHALL be rejected

### Requirement: Preferences collection exists
The system SHALL define a `preferences` collection in PocketBase via migration code, with fields: `user` (relation to users), `key` (text, required), `value` (text, required). A unique constraint SHALL exist on the combination of `user` + `key`.

#### Scenario: Preferences collection is created on first run
- **WHEN** PocketBase server starts for the first time
- **THEN** a `preferences` collection SHALL be created automatically via migration

#### Scenario: Preference key-value is stored
- **WHEN** a user sets a preference with key `language` and value `zh-CN`
- **THEN** the record SHALL be stored with `user` relation, `key` = `language`, `value` = `zh-CN`
- **AND** setting the same `key` again SHALL update the existing value

### Requirement: API rules are configured
The system SHALL configure PocketBase API rules via migration so that favorites and preferences are only accessible by their owning user.

#### Scenario: User can only access own favorites
- **WHEN** user A requests list of favorites
- **THEN** PocketBase SHALL only return favorites where `user` = current user's ID
- **AND** user A SHALL NOT see user B's favorites

#### Scenario: Unauthenticated access is denied
- **WHEN** an unauthenticated request is sent to favorites or preferences endpoints
- **THEN** PocketBase SHALL return HTTP 401
