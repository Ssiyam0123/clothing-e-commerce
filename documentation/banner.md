# Banner & Campaign API Documentation

Base URL: `/api/banner-campaigns`

This API manages the homepage carousel banners and marketing campaigns.

---

## 1. Public Endpoints

### Get Active Campaign
`GET /active`

Returns the currently active campaign with its banner images and links.

**Response:**
```json
{
  "_id": "64b1f...",
  "name": "Eid Collection 2024",
  "slideImages": [
    {
      "url": "https://...",
      "link": "/category/eid-collection",
      "alt": "Eid Banner 1"
    }
  ],
  "isActive": true
}
```

---

## 2. Admin Endpoints (Private/Admin Only)

### Get All Campaigns
`GET /`

Returns a list of all campaigns (active and inactive).

---

### Create Campaign
`POST /`

Supports multipart/form-data for multiple image uploads.

**Fields:**
- `name`: string
- `slideImages`: Array of image files
- `links`: Array of strings (corresponding to images)
- `isActive`: boolean

---

### Update Campaign
`PUT /:id`

---

### Toggle Active Status
`PATCH /:id/toggle`

Quickly enable/disable a campaign.

---

### Delete Campaign
`DELETE /:id`
