# Product API Documentation (Detailed)

Base URL: `/api/products`

---

## 1. Public Endpoints

### Get All Products
`GET /`

**Query Parameters:** `category`, `subcategory`, `search`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`.

**Response:**
```json
{
  "success": true,
  "total": 1,
  "pages": 1,
  "products": [
    {
      "_id": "64c5f...",
      "name": "Tactical Oversized Hoodie",
      "slug": "tactical-oversized-hoodie",
      "price": 3500,
      "discount": 15,
      "images": ["https://res.cloudinary.com/..."], // Returns only the 1st image in list view
      "category": { "name": "Outerwear", "slug": "outerwear" },
      "subcategory": { "name": "Hoodies", "slug": "hoodies" },
      "sizes": [
        { "size": { "name": "L" }, "stock": 10 },
        { "size": { "name": "XL" }, "stock": 5 }
      ],
      "totalStock": 15,
      "isFeatured": true
    }
  ]
}
```

---

### Get Product Details
`GET /details/:slug`

**Response:**
```json
{
  "_id": "64c5f...",
  "name": "Tactical Oversized Hoodie",
  "description": "Premium artifact for urban exploration...",
  "price": 3500,
  "discount": 15,
  "images": ["url1", "url2", "url3"],
  "category": { "name": "Outerwear", "slug": "outerwear" },
  "subcategory": { "name": "Hoodies", "slug": "hoodies" },
  "sizes": [
    { "size": { "name": "L" }, "stock": 10 },
    { "size": { "name": "XL" }, "stock": 5 }
  ],
  "tags": ["urban", "black", "hoodie"],
  "isFeatured": true,
  "showReviews": true,
  "createdAt": "2024-05-11T..."
}
```

---

## 2. Admin Endpoints
Base URL: `/api/admin/products`

### Create Product
`POST /` (Uses `multipart/form-data`)

**Request Fields:**
- `name`: "Product Name" (string)
- `slug`: "product-name" (string)
- `description`: "Long text" (string)
- `price`: 1500 (number)
- `discount`: 10 (number, optional)
- `category`: "CATEGORY_ID" (ObjectId string)
- `subcategory`: "SUBCATEGORY_ID" (ObjectId string)
- `images`: [File1, File2] (array of files, max 5)
- `sizes`: `"[{\"size\":\"SIZE_ID\",\"stock\":10}]"` (JSON string encoded)
- `tags`: "summer,cotton" (comma separated string)
- `isActive`: true (boolean)
- `isFeatured`: false (boolean)

**Response:** Returns the newly created Product object.

---

### Update Product
`PUT /:id` (Uses `multipart/form-data`)

**Request Fields:** Same as Create, all optional. If you send `images`, they will be added or replace existing based on logic.
