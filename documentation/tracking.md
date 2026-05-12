# Tracking API (Facebook CAPI) Documentation

Base URL: `/api/track`

This API handles server-side event tracking for Facebook Conversion API (CAPI).

---

## 1. Send Tracking Event
`POST /`

**Request Body:**
```json
{
  "eventName": "ViewContent", // e.g., "AddToCart", "Purchase", "ViewContent"
  "eventData": {
    "content_name": "Product Name",
    "value": 1500,
    "currency": "BDT"
  },
  "userData": {
    "email": "john@example.com", // Optional, will be merged with logged-in user data
    "phone": "017XXXXXXXX"
  },
  "eventId": "UNIQUE_EVENT_ID", // Required for deduplication with Pixel
  "eventSourceUrl": "https://yoursite.com/product/slug"
}
```

**Cookies:**
The API automatically captures `_fbp` and `_fbc` cookies from the request if they exist.

**Response:**
```json
{ "success": true }
```
