/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Create organizations collection
    const organizationsCollection = new Collection({
        "id": "organizations",
        "name": "organizations",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "name",
                "name": "name",
                "type": "text",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "min": 1,
                    "max": 255,
                    "pattern": ""
                }
            },
            {
                "id": "description",
                "name": "description",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            },
            {
                "id": "owner",
                "name": "owner",
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
        "listRule": "@request.auth.id != '' && (owner.id = @request.auth.id || user_organizations_via_organization.user.id ?= @request.auth.id)",
        "viewRule": "@request.auth.id != '' && (owner.id = @request.auth.id || user_organizations_via_organization.user.id ?= @request.auth.id)",
        "createRule": "@request.auth.id != ''",
        "updateRule": "@request.auth.id != '' && (owner.id = @request.auth.id || user_organizations_via_organization.user.id ?= @request.auth.id && user_organizations_via_organization.role ?= 'admin')",
        "deleteRule": "@request.auth.id != '' && owner.id = @request.auth.id",
        "options": {}
    });

    return Dao(db).saveCollection(organizationsCollection);
}, (db) => {
    // Rollback - delete organizations collection
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("organizations");
    return dao.deleteCollection(collection);
});
