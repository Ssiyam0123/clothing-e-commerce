# Admin API Documentation

Base URL: `/api/admin`

This module provides high-level dashboard data and integrates admin routes for other modules. All endpoints require `Admin` privileges.

---

## 1. Dashboard Statistics
`GET /dashboard`

Returns aggregated statistics for the admin dashboard.

**Response:**
```json
{
  "revenue": {
    "total": 150000,
    "avgOrder": 1250,
    "today": 5000,
    "trend": [
      { "_id": "2024-05-01", "revenue": 12000, "orderCount": 10 }
    ],
    "forecast": 180000
  },
  "analytics": {
    "mostSoldCategories": [
      { "name": "Men", "sales": 45, "revenue": 55000 },
      { "name": "Women", "sales": 30, "revenue": 42000 }
    ],
    "retentionRate": 25
  },
  "inventory": {
    "totalProducts": 85,
    "outOfStock": 5,
    "criticalItems": [
      { "name": "Classic Tee", "stock": 2, "status": "LOW" }
    ]
  },
  "categories": [
    { "name": "Men", "count": 40 },
    { "name": "Women", "count": 45 }
  ],
  "customers": {
    "total": 450,
    "newThisMonth": 25
  },
  "recentOrders": [...]
}
```

---

## 2. Integrated Modules
The Admin API serves as a gateway to other module-specific admin controls:

- **Products:** `/api/admin/products`
- **Categories:** `/api/admin/categories`
- **Flash Sales:** `/api/admin/flash-sales`
- **Orders:** `/api/admin/orders`

*Refer to the individual documentation files for detailed endpoint descriptions of these modules.*
