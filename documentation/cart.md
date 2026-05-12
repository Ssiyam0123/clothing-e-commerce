# Cart API Documentation

Base URL: `/api/cart`

The Cart API supports both guest (session-based on frontend) and authenticated users. When a user logs in, the frontend should use `bulk-add` to sync the local cart with the server.

---

## 1. Get Cart
`GET /`

Returns the current user's cart. If the user is not logged in, it depends on how `optionalAuth` middleware handles it (usually returns empty or session-based).

**Response:**
```json
{
  "_id": "64b1c...",
  "user": "64b1d...",
  "items": [
    {
      "product": {
        "_id": "64b1e...",
        "name": "Classic Black Tee",
        "price": 1200,
        "discount": 10,
        "images": ["url1", "url2"],
        "slug": "classic-black-tee",
        "isActive": true
      },
      "size": {
        "_id": "64b1f...",
        "name": "M"
      },
      "quantity": 2
    }
  ],
  "totalItems": 2,
  "totalPrice": 2160
}
```

---

## 2. Add to Cart
`POST /add`

**Request Body:**
```json
{
  "productId": "64b1e...",
  "sizeId": "64b1f...",
  "quantity": 1
}
```

**Response:** Returns the updated cart object.

---

## 3. Update Cart Item Quantity
`PUT /update`

**Request Body:**
```json
{
  "productId": "64b1e...",
  "sizeId": "64b1f...",
  "quantity": 3
}
```

**Response:** Returns the updated cart object. If quantity is `< 1`, the item is removed.

---

## 4. Change Item Size
`PUT /change-size`

Swaps the size of an item already in the cart.

**Request Body:**
```json
{
  "productId": "64b1e...",
  "oldSizeId": "64b1f...",
  "newSizeId": "64b1g..."
}
```

**Response:** Returns the updated cart object.

---

## 5. Remove Item from Cart
`DELETE /remove/:productId/:sizeId`

**Parameters:**
- `productId`: ID of the product
- `sizeId`: ID of the size

**Response:** Returns the updated cart object.

---

## 6. Clear Cart
`DELETE /`

Removes all items from the user's cart.

---

## 7. Bulk Add (Sync)
`POST /bulk-add` (Authenticated Only)

Used during login to sync the guest cart with the user's server-side cart.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "64b1e...",
      "sizeId": "64b1f...",
      "quantity": 2
    },
    {
      "productId": "64b1h...",
      "sizeId": "64b1i...",
      "quantity": 1
    }
  ]
}
```

**Response:** Returns the merged cart object.
