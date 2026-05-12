# Pathao Shipping API Documentation

Base URL: `/api/pathao`

This API provides location data for Pathao courier services.

---

## 1. Get Cities
`GET /cities`

**Response:**
```json
[
  {
    "city_id": 1,
    "city_name": "Dhaka"
  },
  {
    "city_id": 2,
    "city_name": "Chittagong"
  }
]
```

---

## 2. Get Zones
`GET /zones/:cityId`

**Response:**
```json
[
  {
    "zone_id": 1,
    "zone_name": "Banani"
  }
]
```

---

## 3. Get Areas
`GET /areas/:zoneId`

**Response:**
```json
[
  {
    "area_id": 1,
    "area_name": "Block A"
  }
]
```

---

## 4. Get Stores (Admin Only)
`GET /stores`

Returns the list of pick-up stores configured in Pathao for this business.
