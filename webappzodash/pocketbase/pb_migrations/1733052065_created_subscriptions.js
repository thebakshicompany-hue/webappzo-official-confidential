/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
    // Create subscriptions collection
    const subscriptionsCollection = new Collection({
        "id": "subscriptions",
        "name": "subscriptions",
        "type": "base",
        "system": false,
        "schema": [
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
                "id": "stripe_customer_id",
                "name": "stripe_customer_id",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "stripe_subscription_id",
                "name": "stripe_subscription_id",
                "type": "text",
                "required": false,
                "presentable": false,
                "unique": true,
                "options": {
                    "min": null,
                    "max": null,
                    "pattern": ""
                }
            },
            {
                "id": "plan",
                "name": "plan",
                "type": "select",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "free",
                        "pro",
                        "enterprise"
                    ]
                }
            },
            {
                "id": "status",
                "name": "status",
                "type": "select",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "active",
                        "canceled",
                        "past_due",
                        "trialing"
                    ]
                }
            }
        ],
        "indexes": [],
        "listRule": "@request.auth.id != '' && (organization.owner.id = @request.auth.id || organization.user_organizations_via_organization.user.id ?= @request.auth.id)",
        "viewRule": "@request.auth.id != '' && (organization.owner.id = @request.auth.id || organization.user_organizations_via_organization.user.id ?= @request.auth.id)",
        "createRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "updateRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "deleteRule": "@request.auth.id != '' && organization.owner.id = @request.auth.id",
        "options": {}
    });

    return Dao(db).saveCollection(subscriptionsCollection);
}, (db) => {
    // Rollback - delete subscriptions collection
    const dao = new Dao(db);
    const collection = dao.findCollectionByNameOrId("subscriptions");
    return dao.deleteCollection(collection);
});
