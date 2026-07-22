# Admin API Specification

> Semua endpoint di bawah ini khusus untuk role **SUPER_ADMIN**. Admin biasa (role `ADMIN`) tidak memiliki akses ke resource ini.

---

# List Admins

**Endpoint**

```
GET /api/admins
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "data": [
        {
            "id": 1,
            "username": "superadmin",
            "name": "Super Admin",
            "role": "SUPER_ADMIN",
            "createdAt": "2026-01-01T10:00:00.000Z",
            "updatedAt": "2026-01-01T10:00:00.000Z"
        },
        {
            "id": 2,
            "username": "admin1",
            "name": "Admin Satu",
            "role": "ADMIN",
            "createdAt": "2026-01-02T09:00:00.000Z",
            "updatedAt": "2026-01-02T09:00:00.000Z"
        }
    ]
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (403 Forbidden)

```json
{
    "message": "Forbidden: requires SUPER_ADMIN role"
}
```

---

# Create Admin

**Endpoint**

```
POST /api/admins
```

> Role selalu dibuat sebagai `ADMIN`. Endpoint ini tidak menerima field `role` dari request — pembuatan akun `SUPER_ADMIN` hanya dilakukan lewat seed/database, agar tidak ada jalur untuk membuat super admin tambahan lewat API.

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

```json
{
    "username": "admin2",
    "password": "password123",
    "name": "Admin Dua"
}
```

## Response Body (201 Created)

```json
{
    "data": {
        "id": 3,
        "username": "admin2",
        "name": "Admin Dua",
        "role": "ADMIN",
        "createdAt": "2026-01-03T08:00:00.000Z",
        "updatedAt": "2026-01-03T08:00:00.000Z"
    }
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Validation error"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (403 Forbidden)

```json
{
    "message": "Forbidden: requires SUPER_ADMIN role"
}
```

## Response Body (409 Conflict)

```json
{
    "message": "Username already exists"
}
```

---

# Reset Admin Password

> SUPER_ADMIN dapat mereset password admin lain, karena tidak ada mekanisme forgot password berbasis email di sistem ini.

**Endpoint**

```
PATCH /api/admins/:id/reset-password
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

```json
{
    "newPassword": "newpassword123"
}
```

## Response Body (200 OK)

```json
{
    "message": "Password reset successfully"
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Validation error"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (403 Forbidden)

```json
{
    "message": "Forbidden: requires SUPER_ADMIN role"
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Admin not found"
}
```

---

# Delete Admin

> SUPER_ADMIN tidak dapat menghapus akunnya sendiri, untuk mencegah kehilangan akses SUPER_ADMIN sepenuhnya.

**Endpoint**

```
DELETE /api/admins/:id
```

## Headers

```
Authorization: Bearer <access_token>
```

## Response Body (200 OK)

```json
{
    "message": "Admin deleted successfully"
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Cannot delete your own account"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (403 Forbidden)

```json
{
    "message": "Forbidden: requires SUPER_ADMIN role"
}
```

## Response Body (404 Not Found)

```json
{
    "message": "Admin not found"
}
```