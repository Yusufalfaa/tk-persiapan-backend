import supertest from "supertest";
import { AdminTest, AuthTest } from "./test-util.js";
import { web } from "../src/application/web.js";
import bcrypt from "bcrypt";

describe('GET /api/admin', () => {

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
            .get("/api/admin?page=1&size=10")
            .set("Authorization", `Bearer ${token}`);

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
    
    it('should reject invalid token', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin?page=1&size=10")
            .set("Authorization", `Bearer ${token}1234`);

        expect(response.status).toBe(401);
    });

    it('should reject admin role', async () => {
        const token = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin?page=1&size=10")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('should not return password hash', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin?page=1&size=10")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.data[0].passwordHash)
            .toBeUndefined();
    });
})

describe('GET /api/admin/:id', () => {

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
            .get("/api/admin/2")
            .set("Authorization", `Bearer ${token}`);

        console.log(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.role).toBe("ADMIN");
    });
    
    it('should reject invalid token', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/2")
            .set("Authorization", `Bearer ${token}1234`);

        expect(response.status).toBe(401);
    });

    it('should reject admin role', async () => {
        const token = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);
    });

    it('should reject admin not found', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/3")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBe("Admin not found");
    });

    it('should not return password hash', async () => {
        const token = await AdminTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.body.data.passwordHash).toBeUndefined();
    });
})

describe('POST /api/admin', () => {

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
            .post("/api/admin")
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
            .post("/api/admin")
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
            .post("/api/admin")
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
            .post("/api/admin")
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
            .post("/api/admin")
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

describe('PATCH /api/admin/:id/reset-password', async () => {

    beforeEach(async () => {
        await AuthTest.create();
        await AdminTest.createSuperAdmin();
    });

    afterEach(async () => {
        await AdminTest.deleteAll();
    });

    it('should be able to reset admin password', async () => {
        const token = await AdminTest.getAccessToken();

            const response = await supertest(web)
                .patch("/api/admin/2/reset-password")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    newPassword: "password123",
                })

            const updated = await AdminTest.get();

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Password reset successfully");
            expect(await bcrypt.compare("password123", updated.passwordHash));


    });

    it('should reject due to validation error', async () => {
        const token = await AdminTest.getAccessToken();

            const response = await supertest(web)
                .patch("/api/admin/2/reset-password")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    newPassword: "",
                })

            expect(response.status).toBe(400);
            expect(response.body.errors).toBeDefined();
    });

    it('should reject due to invalid token', async () => {
        const token = await AdminTest.getAccessToken();

            const response = await supertest(web)
                .patch("/api/admin/2/reset-password")
                .set("Authorization", `Bearer ${token}1234`)
                .send({
                    newPassword: "password123",
                })

            expect(response.status).toBe(401);
            expect(response.body.errors).toBeDefined();
    });

    it('should reject due to forbidden role', async () => {
        const token = await AuthTest.getAccessToken();

            const response = await supertest(web)
                .patch("/api/admin/2/reset-password")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    newPassword: "password123",
                })

            expect(response.status).toBe(403);
            expect(response.body.errors).toBeDefined();
    });

    it('should reject due to admin not found', async () => {
        const token = await AdminTest.getAccessToken();

            const response = await supertest(web)
                .patch("/api/admin/4/reset-password")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    newPassword: "password123",
                })

            console.log(response.body)

            expect(response.status).toBe(404);
            expect(response.body.errors).toBeDefined();
    });

})

describe('DELETE /api/admin/:id', async () => {

    beforeEach(async () => {
        await AuthTest.create();
        await AdminTest.createSuperAdmin();
    });

    afterEach(async () => {
        await AdminTest.deleteAll();
    });

    it('should be able to delete admin', async () => {
        const accessToken = await AdminTest.getAccessToken();
        
        const response = await supertest(web)
            .delete(`/api/admin/2`)
            .set("Authorization", `Bearer ${accessToken}`)      
        
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    })

    it('should reject delete own account (super admin)', async () => {
        const accessToken = await AdminTest.getAccessToken();
        
        const response = await supertest(web)
            .delete(`/api/admin/1`)
            .set("Authorization", `Bearer ${accessToken}`)      
        
        expect(response.status).toBe(400);
        expect(response.body).toBeDefined();
    })

    it('should reject delete due to invalid token', async () => {
        const accessToken = await AdminTest.getAccessToken();
        
        const response = await supertest(web)
            .delete(`/api/admin/2`)
            .set("Authorization", `Bearer ${accessToken}1234`)      
        
        expect(response.status).toBe(401);
        expect(response.body).toBeDefined();
    })

    it('should reject due to forbidden role', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .delete(`/api/admin/1`)
            .set("Authorization", `Bearer ${accessToken}`)      
        
        expect(response.status).toBe(403);
        expect(response.body).toBeDefined();
    })

    it('should reject due to admin not found', async () => {
        const accessToken = await AdminTest.getAccessToken();
        
        const response = await supertest(web)
            .delete(`/api/admin/9999`)
            .set("Authorization", `Bearer ${accessToken}`)      
        
        expect(response.status).toBe(404);
        expect(response.body).toBeDefined();
    })

})