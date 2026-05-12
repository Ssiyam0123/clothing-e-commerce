# Category API Documentation

Base URL: `/api/categories`

---

## 1. Public Endpoints

### Get All Categories
`GET /`

Returns a list of all active categories.

**Response:**
```json
[
  {
    "_id": "64d6a...",
    "name": "Men",
    "slug": "men",
    "description": "Premium apparel for men",
    "image": "https://res.cloudinary.com/..."
  }
]
```

---

## 2. Admin Endpoints (Private/Admin Only)

### Create Category
`POST /api/admin/categories`

Supports multipart/form-data for category image.

**Request Body (form-data):**
- `name`: "Men" (string)
- `slug`: "men" (string)
- `description`: "Description text" (string)
- `image`: File (optional)

**Response:** Returns the created category object.

---

### Update Category
`PUT /api/admin/categories/:id`

**Request Body (form-data):** Same as create (optional).

---

### Delete Category
`DELETE /api/admin/categories/:id`
