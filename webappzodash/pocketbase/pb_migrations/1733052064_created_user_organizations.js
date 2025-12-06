/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Create user_organizations collection
    const userOrganizationsCollection = new Collection({
        "id": "user_organizations",
        "name": "user_organizations",
        "type": "base",
        "system": false,
        "schema": [
            {
                "id": "user",
                "name": "user",
                "type": "relation",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "collectionId": "_pb_users_auth_",
                    "cascadeDelete": true,
                    "minSelect": null,
                    "maxSelect": 1,
                    "displayFields": ["email"]
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
                "id": "role",
                "name": "role",
                "type": "select",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "owner",
                        "admin",
                        "member"
                    ]
                }
            }
        ],
        "indexes": [
            "CREATE UNIQUE INDEX `idx_user_org` ON `user_organizations` (`user`, `organization`)"
        ],
        "listRule": "@request.auth.id != '' && (user.id = @request.auth.id || organization.owner.id = @request.auth.id || (organization.user_organizations_via_organization.user.id ?= @request.auth.id && organization.user_organizations_via_organization.role ?= 'admin'))",
        "viewRule": "@request.auth.id != '' && (user.id = @request.auth.id || organization.owner.id = @request.auth.id || (organization.user_organizations_via_organization.user.id ?= @request.auth.id && organization.user_organizations_via_organization.role ?= 'admin'))",
        "createRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "updateRule": "@request.auth.id != '' && (organization.owner.id = @request.auth.id || (organization.user_organizations_via_organization.user.id ?= @request.auth.id && organization.user_organizations_via_organization.role ?= 'admin'))",
        "deleteRule": "@request.auth.id != '' && (organization.owner.id = @request.auth.id || (organization.user_organizations_via_organization.user.id ?= @request.auth.id && organization.user_organizations_via_organization.role ?= 'admin'))",
        "options": {}
    });

    return Dao(db).saveCollection(userOrganizationsCollection);
}, (db) => {
    // Rollback - delete user_organizations collection
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("user_organizations");
    return dao.deleteCollection(collection);
});
