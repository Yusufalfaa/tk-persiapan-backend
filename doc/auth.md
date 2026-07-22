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

**Endpoint**

```
PUT /api/auth/me
```

## Headers

```
Authorization: Bearer <access_token>
```

## Request Body

Semua field bersifat **opsional**.

```json
{
    "name": "admin satu",
    "password": "newpassword"
}
```

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "username": "admin_updated",
        "name": "Admin Satu",
        "role": "ADMIN",
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

## Response Body (400 Bad Request)

```json
{
    "message": "Nothing to update"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```

## Response Body (409 Conflict)

```json
{
    "message": "Username already exists"
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
