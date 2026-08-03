# News API Specification

---

# Public News API

## List Published News

> Endpoint publik, hanya menampilkan news yang sudah dipublish. Response tidak menyertakan `sections`, hanya metadata dasar untuk daftar/preview.

**Endpoint**

```
GET /api/news
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| page      | Number | No       | 1       |
| size      | Number | No       | 10      |

### Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "title": "Lomba TK 2026",
            "slug": "lomba-tk-2026",
            "thumbnail": "https://your-storage.com/news/photo1.jpg",
            "excerpt": "Deskripsi kegiatan lomba TK tahun ini akan diadakan di halaman sekolah dengan berbagai...",
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

## Get Published News Detail

> Endpoint publik, hanya dapat mengakses news yang sudah dipublish. Response menyertakan seluruh `sections`, sudah terurut berdasarkan `order`.

**Endpoint**

```
GET /api/news/:slug
```

### Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "title": "Lomba TK 2026",
        "slug": "lomba-tk-2026",
        "isPublished": true,
        "sections": [
            {
                "id": 1,
                "type": "TEXT",
                "order": 0,
                "text": "Deskripsi kegiatan lomba TK tahun ini...",
                "imageUrl": null,
                "youtubeUrl": null
            },
            {
                "id": 2,
                "type": "IMAGE",
                "order": 1,
                "text": null,
                "imageUrl": "https://your-storage.com/news/photo1.jpg",
                "youtubeUrl": null
            },
            {
                "id": 3,
                "type": "YOUTUBE",
                "order": 2,
                "text": null,
                "imageUrl": null,
                "youtubeUrl": "https://www.youtube.com/watch?v=xxxxxxx"
            }
        ],
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

### Response Body (404 Not Found)

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

## Admin List News

> Menampilkan seluruh news termasuk draft. Response tidak menyertakan `sections`.

**Endpoint**

```
GET /api/admin/news
```

### Query Parameters

| Parameter | Type   | Required | Default |
| --------- | ------ | -------- | ------- |
| page      | Number | No       | 1       |
| size      | Number | No       | 10      |

### Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "title": "Lomba TK 2026",
            "slug": "lomba-tk-2026",
            "thumbnail": "https://your-storage.com/news/photo1.jpg",
            "excerpt": "Deskripsi kegiatan lomba TK tahun ini akan diadakan di halaman sekolah dengan berbagai...",
            "isPublished": true,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        },
        {
            "id": 2,
            "title": "Draft Berita",
            "slug": "draft-berita",
            "thumbnail": null,
            "excerpt": null,
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

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

---

## Admin Get News Detail

> Menampilkan detail news termasuk draft, beserta seluruh `sections`.

**Endpoint**

```
GET /api/admin/news/:id
```

### Response Body (200 OK)

```json
{
    "data": {
        "id": 2,
        "title": "Draft Berita",
        "slug": "draft-berita",
        "isPublished": false,
        "sections": [
            {
                "id": 4,
                "type": "TEXT",
                "order": 0,
                "text": "Isi berita draft",
                "imageUrl": null,
                "youtubeUrl": null
            }
        ],
        "createdAt": "2026-01-02T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:00:00.000Z"
    }
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

## Create News

> Membuat berita baru (tanpa section). Section ditambahkan lewat endpoint terpisah setelah berita dibuat.

**Endpoint**

```
POST /api/admin/news
```

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
    "title": "Lomba TK 2026"
}
```

### Response Body (201 Created)

```json
{
    "data": {
        "id": 1,
        "title": "Lomba TK 2026",
        "slug": "lomba-tk-2026",
        "isPublished": false,
        "sections": [],
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

### Response Body (400 Bad Request)

```json
{
    "message": "Validation error",
    "errors": {
        "title": "Judul wajib diisi"
    }
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

---

## Update News

> Mengubah `title`/`isPublished` berita. Tidak memengaruhi `sections`. Semua field bersifat opsional.

**Endpoint**

```
PATCH /api/admin/news/:id
```

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
    "title": "Updated title",
    "isPublished": true
}
```

### Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "title": "Updated title",
        "slug": "updated-title",
        "isPublished": false,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T12:00:00.000Z"
    }
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

## Delete News

> Menghapus berita beserta seluruh `sections` di dalamnya (cascade).

**Endpoint**

```
DELETE /api/admin/news/:id
```

### Headers

```
Authorization: Bearer <access_token>
```

### Response Body (200 OK)

```json
{
    "message": "News deleted successfully"
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

# Admin News Section API

> Seluruh endpoint berikut membutuhkan autentikasi admin.

---

## Create Section

> Menambahkan section baru ke sebuah berita. Field yang wajib diisi tergantung `type`:
>
> - `TEXT` → wajib isi `text`
> - `YOUTUBE` → wajib isi `youtubeUrl`
> - `IMAGE` → wajib isi 1 file di `image`

**Endpoint**

```
POST /api/admin/news/:newsId/sections
```

### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Request Body

```json
{
    "type": "IMAGE",
    "text": "Ini section",
    "youtubeUrl": "youtube.com/"
}
```

### Response Body (201 Created)

```json
{
    "data": {
        "id": 2,
        "type": "IMAGE",
        "order": 1,
        "text": null,
        "imageUrl": "https://your-storage.com/news/photo1.jpg",
        "youtubeUrl": null,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

### Response Body (400 Bad Request)

```json
{
    "message": "Validation error",
    "errors": {
        "image": "1 gambar wajib diisi untuk section bertipe IMAGE"
    }
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```

---

## Update Section

> Mengubah isi section (misal ganti teks, ganti link YouTube, atau ganti gambar). Semua field bersifat opsional.

**Endpoint**

```
PATCH /api/admin/news/sections/:sectionId
```

### Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

### Request Body

```json
{
    "text": "Teks yang sudah diperbarui"
}
```

### Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "type": "TEXT",
        "order": 0,
        "text": "Teks yang sudah diperbarui",
        "imageUrl": null,
        "youtubeUrl": null,
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T10:00:00.000Z"
    }
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "Section not found"
}
```

---

## Delete Section

> Menghapus 1 section.

**Endpoint**

```
DELETE /api/admin/news/sections/:sectionId
```

### Headers

```
Authorization: Bearer <access_token>
```

### Response Body (200 OK)

```json
{
    "message": "Section deleted successfully"
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "Section not found"
}
```

---

## Reorder Sections

> Mengubah urutan seluruh section dalam satu berita sekaligus, misal setelah admin drag-and-drop di frontend.

**Endpoint**

```
PATCH /api/admin/news/:newsId/sections/reorder
```

### Headers

```
Authorization: Bearer <access_token>
```

### Request Body

```json
{
    "sections": [
        { "id": 3, "order": 0 },
        { "id": 1, "order": 1 },
        { "id": 2, "order": 2 }
    ]
}
```

### Response Body (200 OK)

```json
{
    "message": "Sections reordered successfully"
}
```

### Response Body (400 Bad Request)

```json
{
    "message": "One or more section IDs do not belong to this news"
}
```

### Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

### Response Body (404 Not Found)

```json
{
    "message": "News not found"
}
```
