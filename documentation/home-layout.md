# Home Layout API Documentation

Base URL: `/api/home-layouts`

This API manages the dynamic sections of the homepage (Hero, Featured Categories, Best Sellers, etc.).

---

## 1. Get Active Layout
`GET /` or `GET /active`

Returns the currently active homepage architecture.

**Response:**
```json
{
  "_id": "64b1f...",
  "name": "Summer Collection Layout",
  "sections": [
    {
      "type": "Hero",
      "data": { "campaignId": "64b1h..." },
      "order": 1
    },
    {
      "type": "FeaturedProducts",
      "title": "New Arrivals",
      "data": { "category": "men" },
      "order": 2
    }
  ],
  "isActive": true
}
```

---

## 2. Admin Management (Admin Only)

### Create Layout
`POST /`

### Update Layout
`PUT /:id`

### Switch Active Layout
`PUT /:id/switch`

Sets a specific layout as the active one.

### Delete Layout
`DELETE /:id`
