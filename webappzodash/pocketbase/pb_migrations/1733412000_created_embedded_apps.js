/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Create embedded_apps collection
    const embeddedAppsCollection = new Collection({
        "id": "embedded_apps",
        "name": "embedded_apps",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "name",
                "name": "name",
                "type": "text",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "min": 1,
                    "max": 255,
                    "pattern": ""
                }
            },
            {
                "id": "url",
                "name": "url",
                "type": "url",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "exceptDomains": [],
                    "onlyDomains": []
                }
            },
            {
                "id": "icon",
                "name": "icon",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": null,
                    "max": 50,
                    "pattern": ""
                }
            },
            {
                "id": "organization",
                "name": "organization",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "organizations",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": ["name"]
                }
            },
            {
                "id": "created_by",
                "name": "created_by",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "_pb_users_auth_",
                    "cascadeDelete": false,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": ["email"]
                }
            }
        ],
        "indexes": [],
        "listRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "viewRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "createRule": "@request.auth.id != ''",
        "updateRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "deleteRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "options": {}
    });

    return Dao(db).saveCollection(embeddedAppsCollection);
}, (db) => {
    // Rollback - delete embedded_apps collection
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("embedded_apps");
    return dao.deleteCollection(collection);
});
