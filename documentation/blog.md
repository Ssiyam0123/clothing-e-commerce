# Blog API Documentation

Base URL: `/api/blogs`

---

## 1. Get All Posts (Public)
`GET /`

**Response:**
```json
[
  {
    "_id": "64b1f...",
    "title": "Summer Fashion Trends",
    "slug": "summer-fashion-trends",
    "summary": "Discover the latest trends...",
    "image": "https://...",
    "author": { "name": "Admin" },
    "createdAt": "2024-05-12T..."
  }
]
```

---

## 2. Get Post by Slug (Public)
`GET /:slug`

---

## 3. Create Blog Post (Admin)
`POST /`

Supports multipart/form-data for the main blog image.

**Request Body (form-data):**
- `title`: string
- `content`: string (HTML supported)
- `summary`: string
- `image`: main image file
- `tags`: comma-separated strings

---

## 4. Get Post by ID (Admin)
`GET /admin/:id`

---

## 5. Update Blog Post (Admin)
`PUT /admin/:id`

---

## 6. Delete Blog Post (Admin)
`DELETE /admin/:id`
