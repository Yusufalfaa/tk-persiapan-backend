# News API Spec

---

## Create News

**Endpoint:** POST /api/news

**Headers:**

- Authorization: Bearer token

**Request Body (multipart/form-data):**

```json
{
  "title": "Lomba TK 2026",
  "content": "Deskripsi Kegiatan ...",
  "image": "file photo"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "title": "Lomba TK 2026",
    "content": "Deskripsi kegiatan...",
    "image": "https://cloudinary.com/xxx.jpg",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "file too large (max 2MB)"
}
```

---

## Get News (Detail)

**Endpoint:** GET /api/news/:id

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "title": "Lomba TK 2026",
    "content": "Deskripsi kegiatan...",
    "image": "https://cloudinary.com/xxx.jpg",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "news not found"
}
```

---

## Update News

**Endpoint:** PUT /api/news/:id

**Headers:**

- Authorization: Bearer token

**Request Body (multipart/form-data):**

```json
{
  "title": "Updated title (optional)",
  "content": "Updated content (optional)",
  "image": "file (optional)"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "title": "Updated title",
    "content": "Updated content",
    "image": "https://cloudinary.com/new.jpg",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-02T12:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "news not found"
}
```

---

## Delete News

**Endpoint:** DELETE /api/news/:id

**Headers:**

- Authorization: Bearer token

**Response Body (Success):**

```json
{
  "message": "news deleted successfully"
}
```

**Response Body (Failed):**

```json
{
  "message": "news not found"
}
```

---

## List News

**Endpoint:** GET /api/news

**Query Params:**

- page: number
- size: number

**Example:**
GET /api/news?page=1&size=10

**Response Body (Success):**

```json
{
  "data": [
    {
      "id": 1,
      "title": "Lomba TK 2026",
      "image": "https://cloudinary.com/xxx.jpg",
      "createdAt": "2026-01-01T10:00:00Z",
      "updatedAt": "2026-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "title": "Kegiatan Belajar",
      "image": "https://cloudinary.com/yyy.jpg",
      "createdAt": "2026-01-02T09:00:00Z",
      "updatedAt": "2026-01-02T09:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "size": 10,
    "total": 100
  }
}
```
