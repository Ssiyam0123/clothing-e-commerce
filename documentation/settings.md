# Settings API Documentation

Base URL: `/api/settings`

Global site settings including branding, contact info, and SEO metadata.

---

## 1. Public Endpoints

### Get Site Settings
`GET /`

Returns the global settings for the application.

**Response:**
```json
{
  "siteName": "Vanguard",
  "logo": "https://...",
  "logoDark": "https://...",
  "favicon": "https://...",
  "contactEmail": "support@vanguard.com",
  "contactPhone": "017XXXXXXXX",
  "address": "Dhaka, Bangladesh",
  "socialLinks": {
    "facebook": "https://facebook.com/vanguard",
    "instagram": "https://instagram.com/vanguard"
  },
  "seo": {
    "title": "Vanguard - Premium Clothing",
    "description": "Premium clothing for modern lifestyles",
    "keywords": "clothing, fashion, e-commerce"
  }
}
```

---

## 2. Admin Endpoints (Private/Admin Only)

### Update Site Settings
`PUT /`

Updates the global settings. Supports multipart/form-data for logo and favicon uploads.

**Request Body (form-data):**
- `siteName`: string
- `logo`: file (optional)
- `logoDark`: file (optional)
- `favicon`: file (optional)
- `contactEmail`: string
- `contactPhone`: string
- `address`: string
- `socialLinks`: JSON string
- `seo`: JSON string
