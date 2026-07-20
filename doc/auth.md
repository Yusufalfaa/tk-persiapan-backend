# Auth API Spec

---

## Login

**Endpoint:** POST /api/auth/login

**Request Body:**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "access_token": "JWT_TOKEN"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "invalid username or password"
}
```

---

## Get Current User

**Endpoint:** GET /api/auth/me

**Headers:**

- Authorization: Bearer token

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "username": "admin",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "unauthorized"
}
```

---

## Update Current User

**Endpoint:** PUT /api/auth/me

**Headers:**

- Authorization: Bearer token

**Request Body:**

```json
{
  "username": "admin_updated",
  "password": "newpassword"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "username": "admin_updated",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-02T12:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "failed to update user"
}
```

---

## Logout

**Endpoint:** POST /api/auth/logout

**Headers:**

- Authorization: Bearer token

**Response Body (Success):**

```json
{
  "message": "logout successful"
}
```
