# Flash Sale API Documentation

Base URL: `/api/flash-sales`

Flash sales are limited-time events where specific products are offered at a discount.

---

## 1. Public Endpoints

### Get Active Flash Sales
`GET /active`

Returns a list of all currently active flash sale events.

---

### Get Current Flash Sale Products
`GET /current`

Returns the products and details of the primary active flash sale (usually displayed on the homepage).

---

### Get Flash Sale by Slug
`GET /slug/:slug`

Returns details of a specific flash sale event by its slug.

---

## 2. Admin Endpoints (Private/Admin Only)

Base URL: `/api/admin/flash-sales`

### Create Flash Sale
`POST /`

**Request Body:**
```json
{
  "name": "Winter Clearance",
  "slug": "winter-clearance",
  "description": "Up to 50% off on all winter wear",
  "startDate": "2024-12-01T00:00:00Z",
  "endDate": "2024-12-31T23:59:59Z",
  "isActive": true,
  "products": [
    {
      "product": "64b1e...",
      "discount": 50
    }
  ]
}
```

### Update Flash Sale
`PUT /:id`

### Delete Flash Sale
`DELETE /:id`
