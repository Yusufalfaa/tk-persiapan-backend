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

## Get Teacher Detail

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

## Response Body (404 Not Found)

```json
{
    "message": "Teacher not found"
}
```

---

# Admin Teacher API

> Seluruh endpoint berikut membutuhkan autentikasi admin.

Headers:

```
Authorization: Bearer <access_token>
```

---

## Admin List Teachers

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

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

---

## Admin Get Teacher Detail

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

## Create Teacher

> `photo` bersifat opsional saat create.

**Endpoint**

```
POST /api/admin/teachers
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

## Request Body

```json
{
    "name": "Ibu Dewi Lestari",
    "position": "Guru Kelas A",
    "photo": "(file, max 2MB)",
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

## Update Teacher

> Memerlukan autentikasi admin. Semua field bersifat opsional. Mengirim `photo` baru akan menggantikan foto lama.

**Endpoint**

```
PATCH /api/admin/teachers/:id
```

## Headers

```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
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

## Delete Teacher

> Memerlukan autentikasi admin.

**Endpoint**

```
DELETE /api/admin/teachers/:id
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