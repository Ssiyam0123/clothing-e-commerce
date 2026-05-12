# Size API Documentation

Base URL: `/api/sizes`

---

## 1. Public Endpoints

### Get All Sizes
`GET /`

**Query Parameters (Optional):**
- `category`: Filter by category ID.

**Response:**
```json
[
  {
    "_id": "64f8c...",
    "name": "M",
    "category": {
      "_id": "64d6a...",
      "name": "Men",
      "slug": "men"
    }
  }
]
```

---

## 2. Admin Endpoints (Private/Admin Only)

### Create Size
`POST /`

**Request Body:**
```json
{
  "name": "XL",
  "category": "64d6a..."
}
```

**Response:** Returns the created size object.

---

### Delete Size
`DELETE /:id`
