# Gallery API Spec

---

## Create Gallery

**Endpoint:** POST /api/gallery

**Headers:**

- Authorization: Bearer token

**Request Body:**

```json
{
  "image": "file image (Max 2MB)",
  "caption": "Kegiatan belajar mengajar"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "image": "https://cloudinary.com/xxx.jpg",
    "caption": "Kegiatan belajar mengajar",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "image must be 2MB max"
}
```

---

## Get Gallery

**Endpoint:** GET /api/gallery/:id

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "image": "https://cloudinary.com/xxx.jpg",
    "caption": "Kegiatan belajar mengajar",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "gallery not found"
}
```

---

## Update Gallery

**Endpoint:** PUT /api/gallery/:id

**Headers:**

- Authorization: Bearer token

**Request Body:**

```json
{
  "image": "file image (Max 2MB)", 
  "caption": "Kegiatan belajar mengajar"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "image": "https://cloudinary.com/xxx.jpg",
    "caption": "Kegiatan belajar mengajar",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "failed to update gallery"
}
```

---

## Delete Gallery

**Endpoint:** DELETE /api/gallery/:id

**Headers:**

- Authorization: Bearer token

**Response Body (Success):**

```json
{
  "message": "gallery deleted successfully"
}
```

**Response Body (Failed):**

```json
{
  "message": "failed to delete gallery"
}
```

---

## Get Gallery List

**Endpoint:** GET /api/gallery

**Query Params:**

- page: number (current page)
- size: number (max image per page)

**Response Body (Success):**

```json
{
  "data": [
    {
      "id": 1,
      "image": "https://cloudinary.com/xxx.jpg",
      "caption": "Kegiatan belajar mengajar",
      "createdAt": "2026-01-01T10:00:00Z",
      "updatedAt": "2026-01-01T10:00:00Z"
    },
    {
      "id": 2,
      "image": "https://cloudinary.com/xxx.jpg",
      "caption": "Kegiatan belajar mengajar",
      "createdAt": "2026-01-01T10:00:00Z",
      "updatedAt": "2026-01-01T10:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "size": 10,
    "total": 100
  }
}
```
