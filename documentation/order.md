# Order API Documentation (Detailed)

Base URL: `/api/orders`

---

## 1. Public Endpoints (Guest & Users)

### Initialize Payment (Checkout)
`POST /init`

**Request Body (What you send):**
```json
{
  "orderItems": [
    {
      "product": "64b1c...", // Product ObjectId
      "name": "Classic Black Tee", // Product name (string)
      "size": "64b2d...", // Size ObjectId
      "quantity": 2, // Number (Integer)
      "price": 1200, // Price per item (Number)
      "image": "https://..." // Thumbnail URL (string)
    }
  ],
  "shippingAddress": {
    "name": "John Doe", // Mandatory
    "email": "john@example.com", // Optional
    "phone": "017XXXXXXXX", // Mandatory
    "address": "House 12, Road 5, Banani, Dhaka" // Mandatory (Single line)
  },
  "paymentMethod": "SSLCommerz", // Options: "SSLCommerz", "bKash", "COD"
  "itemsPrice": 2400,
  "shippingPrice": 60, // Passed separately (Number)
  "totalPrice": 2460,
  "couponCode": "SUMMER10",
  "isDirectBuy": false
}
```

**Response (What you get):**
- **For Online Payment (SSL/bKash):**
  ```json
  {
    "url": "https://sandbox.sslcommerz.com/gwprocess/..." // Redirect user to this URL
  }
  ```
- **For COD:**
  ```json
  {
    "url": "https://yourfrontend.com/payment/success?orderId=64b3e..."
  }
  ```

---

### Get My Orders
`GET /myorders` (Authenticated Only)

**Response:**
```json
[
  {
    "_id": "64b3e...",
    "orderItems": [...],
    "totalPrice": 2460,
    "orderStatus": "Pending",
    "paymentResult": {
      "status": "Pending"
    },
    "createdAt": "2024-05-11T..."
  }
]
```

---

## 2. Admin Endpoints
Base URL: `/api/admin/orders`

### Get All Orders
`GET /`

**Response:** Returns an array of full order objects including user details.

### Update Order Status
`PUT /:id`

**Request Body:**
```json
{
  "orderStatus": "Shipped", // Options: "Pending", "Processing", "Shipped", "Delivered", "Cancelled"
  "paymentResult": {
    "status": "Completed" // Options: "Pending", "Completed", "Failed", "Cancelled"
  }
}
```

**Response:** Returns the updated Order object.

---

### Sync with Pathao
`POST /:id/sync-pathao`

**Response:**
```json
{
  "message": "Consignment created",
  "consignment_id": "PATHAO_ID_123",
  "pathao_status": "Pending"
}
```
