# Wishlist API Documentation

Base URL: `/api/wishlist`

The Wishlist API allows authenticated users to save products for later.

---

## 1. Get Wishlist
`GET /`

Returns the current user's wishlist.

**Response:**
```json
{
  "_id": "64b1f...",
  "user": "64b1d...",
  "products": [
    {
      "_id": "64b1e...",
      "name": "Classic Black Tee",
      "price": 1200,
      "images": ["url1"],
      "slug": "classic-black-tee"
    }
  ]
}
```

---

## 2. Toggle Wishlist Item
`POST /toggle`

Adds a product to the wishlist if it doesn't exist, or removes it if it does.

**Request Body:**
```json
{
  "productId": "64b1e..."
}
```

**Response:** Returns the updated wishlist object.

---

## 3. Clear Wishlist
`DELETE /`

Removes all items from the user's wishlist.
