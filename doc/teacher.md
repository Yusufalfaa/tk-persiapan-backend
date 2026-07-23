# Teacher API Specification

---

# List Teachers

> Endpoint publik, tidak memerlukan autentikasi. Digunakan untuk menampilkan daftar guru di halaman profil sekolah.

**Endpoint**

```
GET /api/teachers
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
            "name": "Ibu Sri Wahyuni",
            "position": "Kepala Sekolah",
            "photoPath": "/uploads/teachers/sri-wahyuni.jpg",
            "order": 0,
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        },
        {
            "id": 2,
            "name": "Ibu Dewi Lestari",
            "position": "Guru Kelas A",
            "photoPath": null,
            "order": 1,
            "createdAt": "2026-01-02T09:00:00.000Z",
            "updatedAt": "2026-01-02T09:00:00.000Z"
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

# Get Teacher

> Endpoint publik, tidak memerlukan autentikasi.

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

## Response Body (404 Not Found)

```json
{
    "message": "Teacher not found"
}
```

---

# Create Teacher

> Memerlukan autentikasi admin.

**Endpoint**

```
POST /api/teachers
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

`photoPath` bersifat **opsional**.

```json
{
    "name": "Ibu Dewi Lestari",
    "position": "Guru Kelas A",
    "photoPath": "/uploads/teachers/dewi-lestari.jpg",
    "order": 1
}
```

## Response Body (201 Created)

```json
{
    "data": {
        "id": 2,
        "name": "Ibu Dewi Lestari",
        "position": "Guru Kelas A",
        "photoPath": "/uploads/teachers/dewi-lestari.jpg",
        "order": 1,
        "createdAt": "2026-01-02T09:00:00.000Z",
        "updatedAt": "2026-01-02T09:00:00.000Z"
    }
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Validation error",
    "errors": {
        "name": "Nama wajib diisi",
        "position": "Jabatan wajib diisi"
    }
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

---

# Update Teacher

> Memerlukan autentikasi admin. Semua field bersifat opsional.

**Endpoint**

```
PUT /api/teachers/:id
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

```json
{
    "name": "Ibu Dewi Lestari, S.Pd.",
    "position": "Wali Kelas A",
    "order": 2
}
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 2,
        "name": "Ibu Dewi Lestari, S.Pd.",
        "position": "Wali Kelas A",
        "photoPath": "/uploads/teachers/dewi-lestari.jpg",
        "order": 2,
        "createdAt": "2026-01-02T09:00:00.000Z",
        "updatedAt": "2026-01-03T11:00:00.000Z"
    }
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Teacher not found"
}
```

---

# Delete Teacher

> Memerlukan autentikasi admin.

**Endpoint**

```
DELETE /api/teachers/:id
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "message": "Teacher deleted successfully"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Teacher not found"
}
```
