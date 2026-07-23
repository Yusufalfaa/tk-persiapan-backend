# News API Specification

---

# Public News API

## List Published News

> Endpoint publik, hanya menampilkan news yang sudah dipublish.

**Endpoint**

```
GET /api/news
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

---

# Get Published News Detail

> Endpoint publik, hanya dapat mengakses news yang sudah dipublish.

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

# Admin News API

> Seluruh endpoint berikut membutuhkan autentikasi admin.

Headers:

```
Authorization: Bearer <access_token>
```

---

# Admin List News

> Menampilkan seluruh news termasuk draft.

**Endpoint**

```
GET /api/admin/news
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
            "title": "Lomba TK 2026",
            "slug": "lomba-tk-2026",
            "imagePath": "https://your-storage.com/news/photo.jpg",
            "isPublished": true,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        },
        {
            "id": 2,
            "title": "Draft Berita",
            "slug": "draft-berita",
            "imagePath": null,
            "isPublished": false,
            "createdAt": "2026-01-02T10:00:00.000Z",
            "updatedAt": "2026-01-02T10:00:00.000Z"
        }
    ],
    "meta": {
        "page": 1,
        "size": 10,
        "total": 50,
        "totalPages": 5
    }
}
```

---

# Admin Get News Detail

> Menampilkan detail news termasuk draft.

**Endpoint**

```
GET /api/admin/news/:id
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 2,
        "title": "Draft Berita",
        "slug": "draft-berita",
        "content": "Isi berita draft",
        "imagePath": null,
        "isPublished": false,
        "createdAt": "2026-01-02T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:00:00.000Z"
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

# Create News

> Memerlukan autentikasi admin.

**Endpoint**

```
POST /api/admin/news
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field       | Type    | Required |
| ----------- | ------- | -------- |
| title       | String  | Yes      |
| content     | String  | Yes      |
| image       | File    | Yes      |
| isPublished | Boolean | No       |

---

# Update News

> Memerlukan autentikasi admin.

**Endpoint**

```
PUT /api/admin/news/:id
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

| Field       | Type    |
| ----------- | ------- |
| title       | String  |
| content     | String  |
| image       | File    |
| isPublished | Boolean |

---

# Delete News

> Memerlukan autentikasi admin.

**Endpoint**

```
DELETE /api/admin/news/:id
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

---
