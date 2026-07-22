import supertest from "supertest";
import { AdminTest, AuthTest } from "./test-util.js";
import { web } from "../src/application/web.js";

describe('GET /api/admins', () => {

    beforeEach(async () => {
        await AuthTest.create();
        await AdminTest.createSuperAdmin();
    });
    
    afterEach(async () => {
        await AdminTest.deleteAll();
    })

    it('should allow super admin', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admins")
            .set("Authorization", `Bearer ${token}`);

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should reject invalid token', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admins")
            .set("Authorization", `Bearer ${token}1234`);

        expect(response.status).toBe(401);
    });

    it('should reject admin role', async () => {
        const token = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admins")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('should not return password hash', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admins")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.data[0].passwordHash)
            .toBeUndefined();
    });
})

describe('POST /api/admins', () => {

    beforeEach(async () => {
        await AuthTest.create()
        await AdminTest.createSuperAdmin();
    });
    
    afterEach(async () => {
        await AdminTest.deleteAll();
    })

    it('should be able to create new admin', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admins")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "admin2",
                password: "password123",
                name: "Admin Dua"
            })

        expect(response.status).toBe(201);
        expect(response.body.data.name).toBe("Admin Dua");
    })

    it('should reject due to validation error', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admins")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "",
                password: "password123",
                name: "Admin Dua"
            })

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject due to invalid token', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admins")
            .set("Authorization", `Bearer ${token}1234`)
            .send({
                username: "admin2",
                password: "password123",
                name: "Admin Dua"
            })
        
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject due to forbidden role', async () => {
        const token = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admins")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "admin2",
                password: "password123",
                name: "Admin Dua"
            })
        
        expect(response.status).toBe(403);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject due to conflict inputs', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admins")
            .set("Authorization", `Bearer ${token}`)
            .send({
                username: "Admin",
                password: "password123",
                name: "Admin Dua"
            })
        
        expect(response.status).toBe(409);
        expect(response.body.errors).toBeDefined();
    })

})