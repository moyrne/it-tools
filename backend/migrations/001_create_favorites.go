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

		collection := core.NewBaseCollection("favorites")

		listRule := "@request.auth.id != '' && @request.auth.id = user.id"
		collection.ListRule = &listRule
		collection.ViewRule = &listRule
		createRule := "@request.auth.id != ''"
		collection.CreateRule = &createRule
		collection.UpdateRule = &listRule
		collection.DeleteRule = &listRule

		userField := &core.RelationField{}
		userField.Name = "user"
		userField.CollectionId = users.Id
		userField.Required = true
		userField.MaxSelect = 1
		collection.Fields.Add(userField)

		toolPathField := &core.TextField{}
		toolPathField.Name = "tool_path"
		toolPathField.Required = true
		collection.Fields.Add(toolPathField)

		return app.Save(collection)
	}, func(app core.App) error {
		collection, _ := app.FindCollectionByNameOrId("favorites")
		if collection != nil {
			return app.Delete(collection)
		}
		return nil
	})
}
