# Auth API Specification

---

# Login

**Endpoint**

```
POST /api/auth/login
```

## Request Body

```json
{
    "username": "admin",
    "password": "123456"
}
```

## Response Body (200 OK)

```json
{
    "data": {
        "accessToken": "JWT_ACCESS_TOKEN"
    }
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Invalid username or password"
}
```

---

# Get Current User

**Endpoint**

```
GET /api/auth/me
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "username": "admin",
        "name": "Admin Satu",
        "role": "ADMIN",
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

---

# Update Current User

> `username` tidak dapat diubah lewat endpoint ini. Untuk mengganti `name` saja, cukup kirim `name`. Untuk mengganti password, wajib kirim `oldPassword` dan `newPassword` sekaligus — `oldPassword` digunakan untuk verifikasi sebelum password baru disimpan.

**Endpoint**

```
PUT /api/auth/me
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

Semua field bersifat **opsional**, tapi `oldPassword` dan `newPassword` harus dikirim bersamaan.

```json
{
    "name": "admin satu",
    "oldPassword": "123456",
    "newPassword": "newpassword"
}
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "username": "admin",
        "name": "admin satu",
        "role": "ADMIN",
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-02T12:00:00.000Z"
    }
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Nothing to update"
}
```

Kemungkinan pesan lain untuk `400`:

```json
{
    "message": "newPassword requires oldPassword"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

Kemungkinan pesan lain untuk `401` (khusus saat ganti password):

```json
{
    "message": "Old password is incorrect"
}
```

---

# Logout

> JWT bersifat stateless, sehingga logout dilakukan dengan menghapus access token di sisi client. Endpoint ini disediakan untuk menjaga konsistensi API.

**Endpoint**

```
POST /api/auth/logout
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "message": "Logout successful"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```
