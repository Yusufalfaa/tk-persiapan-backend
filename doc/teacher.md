# Teacher API Specification

---

# Public Teacher API

## List Teachers

> Endpoint publik, tidak memerlukan autentikasi.

**Endpoint**

```
GET /api/teachers
```

## Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| page      | Number | No       | 1       |
| size      | Number | No       | 10      |

## Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "name": "Ibu Sri Wahyuni",
            "position": "Kepala Sekolah",
            "photoPath": "/uploads/teachers/sri-wahyuni.jpg",
            "order": 0,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 2,
        "totalPages": 1
    }
}
```

---

# Get Teacher Detail

> Endpoint publik.

**Endpoint**

```
GET /api/teachers/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "name": "Ibu Sri Wahyuni",
        "position": "Kepala Sekolah",
        "photoPath": "/uploads/teachers/sri-wahyuni.jpg",
        "order": 0,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

---

# Admin Teacher API

> Semua endpoint berikut membutuhkan autentikasi admin.

Headers:

```
Authorization: Bearer <access_token>
```

---

# Admin List Teachers

> Digunakan untuk dashboard admin.

**Endpoint**

```
GET /api/admin/teachers
```

## Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| page      | Number | No       | 1       |
| size      | Number | No       | 10      |

## Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "name": "Ibu Sri Wahyuni",
            "position": "Kepala Sekolah",
            "photoPath": "/uploads/teachers/sri-wahyuni.jpg",
            "order": 0,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 2,
        "totalPages": 1
    }
}
```

---

# Admin Get Teacher Detail

**Endpoint**

```
GET /api/admin/teachers/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "name": "Ibu Sri Wahyuni",
        "position": "Kepala Sekolah",
        "photoPath": "/uploads/teachers/sri-wahyuni.jpg",
        "order": 0,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

---

# Create Teacher

**Endpoint**

```
POST /api/admin/teachers
```

## Request Body

```json
{
    "name": "Ibu Dewi Lestari",
    "position": "Guru Kelas A",
    "photoPath": "/uploads/teachers/dewi-lestari.jpg",
    "order": 1
}
```

---

# Update Teacher

**Endpoint**

```
PUT /api/admin/teachers/:id
```

## Request Body

```json
{
    "name": "Ibu Dewi Lestari, S.Pd.",
    "position": "Wali Kelas A",
    "order": 2
}
```

---

# Delete Teacher

**Endpoint**

```
DELETE /api/admin/teachers/:id
```

## Response Body

```json
{
    "message": "Teacher deleted successfully"
}
```
