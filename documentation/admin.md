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
  "stats": {
    "totalSales": 150000,
    "totalOrders": 120,
    "totalUsers": 450,
    "totalProducts": 85
  },
  "charts": {
    "salesOverTime": [...],
    "categoryDistribution": [...]
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
