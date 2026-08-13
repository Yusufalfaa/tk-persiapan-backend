# School API Specification

---

# Get School Profile

> Endpoint publik, tidak memerlukan autentikasi.

**Endpoint**

```
GET /api/school
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "name": "TK ABC",
        "vision": "Menjadi sekolah terbaik",
        "address": "Jl. Pendidikan No. 1",
        "googleMapsUrl": "https://maps.google.com/...",
        "phone": "08123456789",
        "email": "tkabc@email.com",
        "videoUrl": "https://youtube.com/...",
        "missions": [
            {
                "id": 1,
                "content": "Mendidik anak dengan baik",
                "order": 0
            },
            {
                "id": 2,
                "content": "Mengembangkan kreativitas anak",
                "order": 1
            }
        ],
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

---

# Update School Profile

> Memerlukan autentikasi admin. Semua field bersifat opsional — hanya field yang dikirim yang akan diperbarui.
>
> Khusus `missions`: jika dikirim, seluruh data misi lama akan digantikan total oleh array yang dikirim (bukan digabung/di-merge). Urutan misi ditentukan dari **posisi di dalam array**, bukan dari field `order` — cukup kirim `content` untuk setiap misi, sesuai urutan tampil yang diinginkan.

**Endpoint**

```
PUT /api/admin/school
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

```json
{
    "name": "TK ABC Updated",
    "vision": "Updated vision",
    "address": "Updated address",
    "googleMapsUrl": "https://maps.google.com/...",
    "phone": "08123456789",
    "email": "updated@email.com",
    "videoUrl": "https://youtube.com/new",
    "missions": [
        { "content": "Updated misi 1" },
        { "content": "Updated misi 2" }
    ]
}
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "name": "TK ABC Updated",
        "vision": "Updated vision",
        "address": "Updated address",
        "googleMapsUrl": "https://maps.google.com/...",
        "phone": "08123456789",
        "email": "updated@email.com",
        "videoUrl": "https://youtube.com/new",
        "missions": [
            {
                "id": 5,
                "content": "Updated misi 1",
                "order": 0
            },
            {
                "id": 6,
                "content": "Updated misi 2",
                "order": 1
            }
        ],
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T12:00:00.000Z"
    }
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Validation error",
    "errors": {
        "email": "Format email tidak valid"
    }
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```
