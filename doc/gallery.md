# Gallery API Specification

---

# Create Gallery

**Endpoint**

```
POST /api/gallery
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field   | Type   | Required | Description                |
| ------- | ------ | -------- | -------------------------- |
| image   | File   | Yes      | Image file (Max 2 MB)      |
| caption | String | Yes      | Image caption              |
| order   | Number | No       | Display order (default: 0) |

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

## Response Body (400 Bad Request)

```json
{
    "message": "Image must be less than 2 MB"
}
```

---

# Get Gallery

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

# Update Gallery

**Endpoint**

```
PUT /api/gallery/:id
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

Semua field bersifat **opsional**.

| Field   | Type   | Required | Description          |
| ------- | ------ | -------- | -------------------- |
| image   | File   | No       | New image (Max 2 MB) |
| caption | String | No       | New caption          |
| order   | Number | No       | Display order        |

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "imagePath": "https://your-storage.com/gallery/photo.jpg",
        "caption": "Kegiatan belajar mengajar",
        "order": 2,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:00:00.000Z"
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

# Delete Gallery

**Endpoint**

```
DELETE /api/gallery/:id
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

## Response Body (404 Not Found)

```json
{
    "message": "Gallery not found"
}
```

---

# Get Gallery List

**Endpoint**

```
GET /api/gallery
```

## Query Parameters

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| page      | Number | No       | Current page (default: 1)    |
| size      | Number | No       | Items per page (default: 10) |

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
        },
        {
            "id": 2,
            "imagePath": "https://your-storage.com/gallery/photo2.jpg",
            "caption": "Perayaan Hari Kartini",
            "order": 2,
            "createdAt": "2026-01-02T10:00:00.000Z",
            "updatedAt": "2026-01-02T10:00:00.000Z"
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
