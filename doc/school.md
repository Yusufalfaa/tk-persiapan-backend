# School API Specification

---

# Get School Profile

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
        "latitude": -6.235336,
        "longitude": 106.882385,
        "googleMapsUrl": "https://maps.google.com/...",
        "phone": "08123456789",
        "email": "tkabc@email.com",
        "videoUrl": "https://youtube.com/...",
        "missions": [
            {
                "id": 1,
                "content": "Mendidik anak dengan baik",
                "order": 1
            },
            {
                "id": 2,
                "content": "Mengembangkan kreativitas anak",
                "order": 2
            }
        ],
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-01T10:00:00.000Z"
    }
}
```

---

# Update School Profile

**Endpoint**

```
PUT /api/school
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
    "latitude": -6.235336,
    "longitude": 106.882385,
    "googleMapsUrl": "https://maps.google.com/...",
    "phone": "08123456789",
    "email": "updated@email.com",
    "videoUrl": "https://youtube.com/new",
    "missions": [
        {
            "content": "Updated misi 1",
            "order": 1
        },
        {
            "content": "Updated misi 2",
            "order": 2
        }
    ]
}
```

> Saat update, daftar `missions` akan menggantikan seluruh data misi yang lama.

## Response Body (200 OK)

```json
{
    "data": {
        "id": 1,
        "name": "TK ABC Updated",
        "vision": "Updated vision",
        "address": "Updated address",
        "latitude": -6.235336,
        "longitude": 106.882385,
        "googleMapsUrl": "https://maps.google.com/...",
        "phone": "08123456789",
        "email": "updated@email.com",
        "videoUrl": "https://youtube.com/new",
        "missions": [
            {
                "id": 1,
                "content": "Updated misi 1",
                "order": 1
            },
            {
                "id": 2,
                "content": "Updated misi 2",
                "order": 2
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
    "message": "Invalid request"
}
```

## Response Body (401 Unauthorized)

```json
{
    "message": "Unauthorized"
}
```
