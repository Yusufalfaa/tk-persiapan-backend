# School API Spec

---

## Get School

**Endpoint:** GET /api/school

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "name": "TK ABC",
    "vision": "Menjadi sekolah terbaik",
    "missions": [
      "Mendidik anak dengan baik",
      "Mengembangkan kreativitas anak",
      "Menanamkan nilai moral"
    ],
    "address": "Jl. Pendidikan No. 1",
    "latitude": -6.235336214483148,
    "longitude": 106.88238569949849,
    "phone": "08123456789",
    "email": "tkabc@email.com",
    "video": "https://youtube.com/xxx",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-01T10:00:00Z"
  }
}
```

---

## Update School

**Endpoint:** PUT /api/school

**Headers:**

* Authorization: Bearer token

**Request Body:**

```json
{
  "name": "TK ABC Updated",
  "vision": "Updated vision",
  "missions": [
    "Updated misi 1",
    "Updated misi 2",
    "Updated misi 3"
  ],
  "address": "Updated address",
  "latitude": -6.235336214483148,
  "longitude": 106.88238569949849,
  "phone": "08123456789",
  "email": "updated@email.com",
  "video": "https://youtube.com/new"
}
```

**Response Body (Success):**

```json
{
  "data": {
    "id": 1,
    "name": "TK ABC Updated",
    "vision": "Updated vision",
    "missions": [
      "Updated misi 1",
      "Updated misi 2",
      "Updated misi 3"
    ],
    "address": "Updated address",
    "latitude": -6.235336214483148,
    "longitude": 106.88238569949849,
    "phone": "08123456789",
    "email": "updated@email.com",
    "video": "https://youtube.com/new",
    "createdAt": "2026-01-01T10:00:00Z",
    "updatedAt": "2026-01-02T12:00:00Z"
  }
}
```

**Response Body (Failed):**

```json
{
  "message": "failed to update school"
}
```
