# Review API Documentation

Base URL: `/api/reviews`

---

## 1. Get Product Reviews
`GET /product/:productId`

**Response:**
```json
[
  {
    "_id": "64b1f...",
    "user": {
      "name": "John Doe",
      "avatar": "https://..."
    },
    "rating": 5,
    "comment": "Excellent quality!",
    "images": ["url1", "url2"],
    "createdAt": "2024-05-12T..."
  }
]
```

---

## 2. Create Review (Authenticated)
`POST /`

Supports multipart/form-data for review images.

**Request Body (form-data):**
- `product`: Product ID
- `rating`: Number (1-5)
- `comment`: string
- `images`: Array of image files (max 5)

**Response:** Returns the created review object.

---

## 3. Update Review (Authenticated)
`PUT /:reviewId`

Users can update their own reviews.

---

## 4. Delete Review (Authenticated)
`DELETE /:reviewId`

Users can delete their own reviews.
