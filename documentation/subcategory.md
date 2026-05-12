# Subcategory API Documentation

Base URL: `/api/subcategories`

---

## 1. Public Endpoints

### Get All Subcategories
`GET /`

**Query Parameters (Optional):**
- `category`: Filter by category ID.

**Response:**
```json
[
  {
    "_id": "64e7b...",
    "name": "T-Shirts",
    "slug": "t-shirts",
    "category": {
      "_id": "64d6a...",
      "name": "Men"
    },
    "image": "https://res.cloudinary.com/...",
    "description": "Casual t-shirts"
  }
]
```

---

### Get Subcategory by ID
`GET /:id`

---

## 2. Admin Endpoints (Private/Admin Only)

### Create Subcategory
`POST /`

Supports multipart/form-data for subcategory image.

**Request Body (form-data):**
- `name`: "T-Shirts" (string)
- `slug`: "t-shirts" (string)
- `category`: "64d6a..." (Category ID string)
- `description`: "text" (optional)
- `image`: File (optional)

**Response:** Returns the created subcategory object.

---

### Update Subcategory
`PUT /:id`

---

### Delete Subcategory
`DELETE /:id`
