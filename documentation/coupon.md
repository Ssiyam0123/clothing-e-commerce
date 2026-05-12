# Coupon API Documentation

Base URL: `/api/coupons`

---

## 1. Public Endpoints

### Validate Coupon
`POST /validate`

Checks if a coupon is valid for the current cart total and calculates the discount.

**Request Body:**
```json
{
  "code": "SUMMER20",
  "cartTotal": 5000
}
```

**Response:**
```json
{
  "valid": true,
  "discountAmount": 1000,
  "coupon": {
    "code": "SUMMER20",
    "discountType": "percentage",
    "discountValue": 20,
    "maxDiscount": 2000,
    "minOrderAmount": 1000,
    "isActive": true
  }
}
```

---

## 2. Admin Endpoints (Authenticated & Admin Only)

### Create Coupon
`POST /`

**Request Body:**
```json
{
  "code": "DISCOUNT50",
  "discountType": "fixed", // "percentage" or "fixed"
  "discountValue": 500,
  "minOrderAmount": 2000,
  "maxDiscount": 500, // Relevant for percentage type
  "usageLimit": 100,
  "startDate": "2024-05-12T00:00:00Z",
  "endDate": "2024-06-12T23:59:59Z",
  "isActive": true
}
```

### Get All Coupons
`GET /`

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 30)
- `search`: Filter by code

### Get Coupon Details (with Forensic Audit)
`GET /:id`

Returns coupon details along with its usage history in orders.

**Response includes:**
- `usageHistory`: Paginated list of orders that used this coupon.
- `uniqueProductsCount`: Number of unique products impacted by this coupon.
- `usagePagination`: Pagination details for usage history.

### Update Coupon
`PUT /:id`

### Delete Coupon
`DELETE /:id`
