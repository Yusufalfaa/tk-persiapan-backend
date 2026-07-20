# News API Specification

---

# Create News

**Endpoint**

```
POST /api/news
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field       | Type    | Required | Description      |
| ----------- | ------- | -------- | ---------------- |
| title       | String  | Yes      | News title       |
| content     | String  | Yes      | News content     |
| image       | File    | Yes      | Image (Max 2 MB) |
| isPublished | Boolean | No       | Default: true    |

## Response Body (201 Created)

```json
{
    "data": {
        "id": 1,
        "title": "Lomba TK 2026",
        "slug": "lomba-tk-2026",
        "content": "Deskripsi kegiatan...",
        "imagePath": "https://your-storage.com/news/photo.jpg",
        "isPublished": true,
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

# Get News Detail

**Endpoint**

```
GET /api/news/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "title": "Lomba TK 2026",
        "slug": "lomba-tk-2026",
        "content": "Deskripsi kegiatan...",
        "imagePath": "https://your-storage.com/news/photo.jpg",
        "isPublished": true,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

## Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

# Update News

**Endpoint**

```
PUT /api/news/:id
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

Semua field bersifat **opsional**.

| Field       | Type    |
| ----------- | ------- |
| title       | String  |
| content     | String  |
| image       | File    |
| isPublished | Boolean |

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "title": "Updated title",
        "slug": "updated-title",
        "content": "Updated content",
        "imagePath": "https://your-storage.com/news/new-photo.jpg",
        "isPublished": false,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T12:00:00.000Z"
    }
}
```

## Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

# Delete News

**Endpoint**

```
DELETE /api/news/:id
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "message": "News deleted successfully"
}
```

## Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

# List News

**Endpoint**

```
GET /api/news
```

## Query Parameters

| Parameter | Type   | Required | Description |
| --------- | ------ | -------- | ----------- |
| page      | Number | No       | Default: 1  |
| size      | Number | No       | Default: 10 |

## Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "title": "Lomba TK 2026",
            "slug": "lomba-tk-2026",
            "imagePath": "https://your-storage.com/news/photo.jpg",
            "isPublished": true,
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
