package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/migrations"
)

func init() {
	migrations.Register(func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		hasUsername := false
		for _, f := range users.Fields {
			if f.GetName() == "username" {
				hasUsername = true
				break
			}
		}

		if !hasUsername {
			usernameField := &core.TextField{}
			usernameField.Name = "username"
			usernameField.Required = true
			users.Fields.Add(usernameField)

			users.PasswordAuth.IdentityFields = []string{"email", "username"}

			users.AddIndex("idx_users_username", true, "username", "")

			if err := app.Save(users); err != nil {
				return err
			}
		}

		return nil
	}, func(app core.App) error {
		users, err := app.FindCollectionByNameOrId("users")
		if err != nil {
			return err
		}

		users.PasswordAuth.IdentityFields = []string{"email"}
		users.RemoveIndex("idx_users_username")

		fieldsToKeep := make(core.FieldsList, 0, len(users.Fields))
		for _, f := range users.Fields {
			if f.GetName() != "username" {
				fieldsToKeep = append(fieldsToKeep, f)
			}
		}
		users.Fields = fieldsToKeep

		return app.Save(users)
	})
}
