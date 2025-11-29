# Cashier System API Specification

REST API for integration with external cashier/POS systems.

---

## 🔐 Authentication

### API Key Authentication

All cashier API requests require an API key in the header:

```http
Authorization: Bearer ch_live_xxxxxxxxxxxxxxxxxxxxxx
```

### Generating API Keys

API keys are created by admins in the admin panel. Each key has:
- **Name**: Identifier (e.g., "Main Reception", "Beach Bar")
- **Permissions**: `read`, `write`, `checkin`, `checkout`
- **Active status**: Can be deactivated without deletion

### Key Format
```
ch_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  (Production)
ch_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxx  (Development)
```

---

## 📋 Base URL

```
Production: https://campholiday.eu/api/cashier/v1
Development: http://localhost:3000/api/cashier/v1
```

---

## 🔄 Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |
| GET | `/bookings/today` | Today's arrivals & departures |
| GET | `/bookings/search` | Search bookings |
| GET | `/bookings/:id` | Get booking details |
| POST | `/bookings/:id/checkin` | Mark guest as checked in |
| POST | `/bookings/:id/checkout` | Mark guest as checked out |
| PATCH | `/bookings/:id/payment` | Update payment status |
| GET | `/parcels` | List all parcels |
| GET | `/parcels/:id/availability` | Check parcel availability |

---

## 📖 Endpoint Details

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-07-15T10:30:00Z",
  "version": "1.0.0"
}
```

---

### Today's Bookings

Get all arrivals and departures for today (or specified date).

```http
GET /bookings/today
GET /bookings/today?date=2025-07-15
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `date` | string | Date in YYYY-MM-DD format (default: today) |

**Response:**
```json
{
  "date": "2025-07-15",
  "arrivals": [
    {
      "id": "uuid",
      "booking_code": "CH-ABC123",
      "parcel_code": "A5",
      "zone_name": "Tent Zone A",
      "guest_name": "John Smith",
      "guest_phone": "+385 91 123 4567",
      "check_in_date": "2025-07-15",
      "check_out_date": "2025-07-20",
      "guests": {
        "adults": 2,
        "children_5_11": 1,
        "children_0_4": 0
      },
      "services": [
        { "name": "Electricity", "quantity": 1 },
        { "name": "Car Parking", "quantity": 1 }
      ],
      "total_price": 198.00,
      "payment_status": "partial",
      "deposit_paid": true,
      "deposit_amount": 59.40,
      "balance_due": 138.60,
      "notes": "Arriving late around 6 PM",
      "status": "confirmed",
      "checked_in": false
    }
  ],
  "departures": [
    {
      "id": "uuid",
      "booking_code": "CH-XYZ789",
      "parcel_code": "B12",
      "zone_name": "Tent Zone B",
      "guest_name": "Maria Garcia",
      "check_in_date": "2025-07-10",
      "check_out_date": "2025-07-15",
      "total_price": 250.00,
      "payment_status": "paid",
      "balance_due": 0,
      "checked_out": false
    }
  ],
  "summary": {
    "total_arrivals": 5,
    "total_departures": 3,
    "pending_payments": 2,
    "total_balance_due": 347.60
  }
}
```

---

### Search Bookings

```http
GET /bookings/search?q=Smith
GET /bookings/search?code=CH-ABC123
GET /bookings/search?parcel=A5
GET /bookings/search?date_from=2025-07-01&date_to=2025-07-31
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search guest name, email, phone |
| `code` | string | Exact booking code |
| `parcel` | string | Parcel code |
| `status` | string | pending, confirmed, cancelled, completed |
| `date_from` | string | Check-in from date |
| `date_to` | string | Check-in to date |
| `limit` | number | Results per page (default: 20, max: 100) |
| `offset` | number | Pagination offset |

**Response:**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "booking_code": "CH-ABC123",
      "parcel_code": "A5",
      "zone_name": "Tent Zone A",
      "guest_name": "John Smith",
      "guest_email": "john@example.com",
      "check_in_date": "2025-07-15",
      "check_out_date": "2025-07-20",
      "status": "confirmed",
      "payment_status": "partial",
      "total_price": 198.00
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

---

### Get Booking Details

```http
GET /bookings/:id
GET /bookings/code/:booking_code
```

**Response:**
```json
{
  "id": "uuid",
  "booking_code": "CH-ABC123",
  "parcel": {
    "id": "uuid",
    "code": "A5",
    "zone_id": "uuid",
    "zone_name": "Tent Zone A",
    "zone_type": "tent"
  },
  "dates": {
    "check_in": "2025-07-15",
    "check_out": "2025-07-20",
    "nights": 5,
    "check_in_time": "14:00",
    "check_out_time": "12:00"
  },
  "guest": {
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+385 91 123 4567",
    "address": "123 Main St",
    "city": "Zagreb",
    "country": "HR"
  },
  "guests": {
    "adults": 2,
    "children_5_11": 1,
    "children_0_4": 0,
    "total": 3
  },
  "services": [
    {
      "id": "uuid",
      "name": "Electricity",
      "quantity": 1,
      "unit_price": 5.00,
      "total_price": 25.00
    },
    {
      "id": "uuid",
      "name": "Car Parking",
      "quantity": 1,
      "unit_price": 5.00,
      "total_price": 25.00
    }
  ],
  "pricing": {
    "base_price": 130.00,
    "services_price": 50.00,
    "tourist_tax": 18.00,
    "discount": 0,
    "total_price": 198.00,
    "deposit_amount": 59.40,
    "deposit_paid": true,
    "balance_due": 138.60
  },
  "status": {
    "booking": "confirmed",
    "payment": "partial",
    "checked_in": false,
    "checked_in_at": null,
    "checked_out": false,
    "checked_out_at": null
  },
  "notes": "Arriving late around 6 PM",
  "admin_notes": "",
  "created_at": "2025-06-01T10:30:00Z",
  "updated_at": "2025-07-10T14:22:00Z"
}
```

---

### Check In Guest

```http
POST /bookings/:id/checkin
```

**Request Body:**
```json
{
  "notes": "Arrived at 18:30"
}
```

**Response:**
```json
{
  "success": true,
  "booking_code": "CH-ABC123",
  "checked_in_at": "2025-07-15T18:30:00Z",
  "message": "Guest checked in successfully"
}
```

**Errors:**
```json
{
  "success": false,
  "error": "ALREADY_CHECKED_IN",
  "message": "Guest is already checked in"
}
```

---

### Check Out Guest

```http
POST /bookings/:id/checkout
```

**Request Body:**
```json
{
  "notes": "All clear, no damages"
}
```

**Response:**
```json
{
  "success": true,
  "booking_code": "CH-ABC123",
  "checked_out_at": "2025-07-20T10:45:00Z",
  "final_balance": 0,
  "message": "Guest checked out successfully"
}
```

**Errors:**
```json
{
  "success": false,
  "error": "BALANCE_DUE",
  "message": "Outstanding balance of €138.60. Process payment first."
}
```

---

### Update Payment Status

```http
PATCH /bookings/:id/payment
```

**Request Body:**
```json
{
  "payment_status": "paid",
  "payment_method": "cash",
  "amount": 138.60,
  "notes": "Full payment received"
}
```

**Valid payment_status values:**
- `unpaid` - No payment received
- `partial` - Deposit or partial payment
- `paid` - Full payment received

**Response:**
```json
{
  "success": true,
  "booking_code": "CH-ABC123",
  "payment_status": "paid",
  "total_paid": 198.00,
  "balance_due": 0,
  "message": "Payment recorded successfully"
}
```

---

### List Parcels

```http
GET /parcels
GET /parcels?zone_type=tent
GET /parcels?status=active
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `zone_id` | string | Filter by zone UUID |
| `zone_type` | string | tent, camper, glamping |
| `status` | string | active, maintenance, inactive |

**Response:**
```json
{
  "parcels": [
    {
      "id": "uuid",
      "code": "A1",
      "name": null,
      "zone": {
        "id": "uuid",
        "name": "Tent Zone A",
        "type": "tent"
      },
      "capacity_max": 4,
      "has_electricity": true,
      "has_water": false,
      "status": "active",
      "current_booking": null
    },
    {
      "id": "uuid",
      "code": "G1",
      "name": "Gdinj",
      "zone": {
        "id": "uuid",
        "name": "Glamping Hvar",
        "type": "glamping"
      },
      "capacity_max": 3,
      "has_electricity": true,
      "has_water": true,
      "status": "active",
      "current_booking": {
        "booking_code": "CH-ABC123",
        "guest_name": "John Smith",
        "check_out_date": "2025-07-20"
      }
    }
  ]
}
```

---

### Check Parcel Availability

```http
GET /parcels/:id/availability?check_in=2025-07-20&check_out=2025-07-25
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `check_in` | string | Yes | Check-in date (YYYY-MM-DD) |
| `check_out` | string | Yes | Check-out date (YYYY-MM-DD) |

**Response (Available):**
```json
{
  "available": true,
  "parcel_code": "A5",
  "check_in": "2025-07-20",
  "check_out": "2025-07-25",
  "nights": 5,
  "estimated_price": {
    "base_price": 150.00,
    "tourist_tax": 18.00,
    "total": 168.00
  }
}
```

**Response (Unavailable):**
```json
{
  "available": false,
  "parcel_code": "A5",
  "check_in": "2025-07-20",
  "check_out": "2025-07-25",
  "reason": "Conflicts with booking CH-XYZ789 (2025-07-18 to 2025-07-22)",
  "next_available": "2025-07-22"
}
```

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid or missing API key |
| `FORBIDDEN` | 403 | API key lacks required permission |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `CONFLICT` | 409 | Operation conflicts (e.g., double booking) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 🔢 Rate Limiting

- **Limit**: 100 requests per minute per API key
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1689436800
  ```

---

## 📝 Webhooks (Future)

For real-time updates, configure webhooks in admin panel:

```json
{
  "url": "https://your-cashier.com/webhook",
  "events": ["booking.created", "booking.updated", "booking.cancelled"],
  "secret": "webhook_secret_xxx"
}
```

---

## 🧪 Testing

### Test API Key

For development/testing:
```
ch_test_development_key_12345
```

### Test Booking Codes

| Code | Status | Payment |
|------|--------|---------|
| `CH-TEST01` | confirmed | paid |
| `CH-TEST02` | confirmed | partial |
| `CH-TEST03` | pending | unpaid |
| `CH-TEST04` | cancelled | - |

---

*Next: [14-LOCALIZATION-GUIDE.md](./14-LOCALIZATION-GUIDE.md) for i18n setup*

