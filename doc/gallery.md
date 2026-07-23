# Gallery API Specification

---

# Public Gallery API

## Get Gallery List

> Endpoint publik, tidak memerlukan autentikasi.

**Endpoint**

```
GET /api/gallery
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
            "imagePath": "https://your-storage.com/gallery/photo1.jpg",
            "caption": "Kegiatan belajar mengajar",
            "order": 1,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 25,
        "totalPages": 3
    }
}
```

---

# Get Gallery Detail

> Endpoint publik, tidak memerlukan autentikasi.

**Endpoint**

```
GET /api/gallery/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "imagePath": "https://your-storage.com/gallery/photo.jpg",
        "caption": "Kegiatan belajar mengajar",
        "order": 1,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Gallery not found"
}
```

---

# Admin Gallery API

> Semua endpoint berikut membutuhkan autentikasi admin.

Headers:

```
Authorization: Bearer <access_token>
```

---

# Admin Get Gallery List

> Menampilkan seluruh data gallery untuk dashboard admin.

**Endpoint**

```
GET /api/admin/gallery
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
            "imagePath": "https://your-storage.com/gallery/photo1.jpg",
            "caption": "Kegiatan belajar mengajar",
            "order": 1,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 25,
        "totalPages": 3
    }
}
```

---

# Admin Get Gallery Detail

> Menampilkan detail gallery untuk dashboard admin.

**Endpoint**

```
GET /api/admin/gallery/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "imagePath": "https://your-storage.com/gallery/photo.jpg",
        "caption": "Kegiatan belajar mengajar",
        "order": 1,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Gallery not found"
}
```

---

# Create Gallery

> Memerlukan autentikasi admin.

**Endpoint**

```
POST /api/admin/gallery
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field   | Type   | Required | Description           |
| ------- | ------ | -------- | --------------------- |
| image   | File   | Yes      | Image file (Max 2 MB) |
| caption | String | Yes      | Image caption         |
| order   | Number | No       | Display order         |

## Response Body (201 Created)

```json
{
    "data": {
        "id": 1,
        "imagePath": "https://your-storage.com/gallery/photo.jpg",
        "caption": "Kegiatan belajar mengajar",
        "order": 1,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

---

# Update Gallery

> Memerlukan autentikasi admin.

**Endpoint**

```
PUT /api/admin/gallery/:id
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field   | Type   | Required |
| ------- | ------ | -------- |
| image   | File   | No       |
| caption | String | No       |
| order   | Number | No       |

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "imagePath": "https://your-storage.com/gallery/photo.jpg",
        "caption": "Updated caption",
        "order": 2,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:00:00.000Z"
    }
}
```

---

# Delete Gallery

> Memerlukan autentikasi admin.

**Endpoint**

```
DELETE /api/admin/gallery/:id
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "message": "Gallery deleted successfully"
}
```

---
