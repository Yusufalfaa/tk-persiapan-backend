import supertest from "supertest";
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js";
import { AuthTest } from "./utils/auth-test.js";
import bcrypt from "bcrypt";
describe('POST /api/auth/login', () => {
    
    beforeEach(async () => {
        await AuthTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
    })

    it('login should be success', async () => {
        const response = await supertest(web).post("/api/auth/login").send({
            username: "Admin",
            password: "Admin123"
        });

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.accessToken).toBeDefined();
        expect(typeof response.body.data.accessToken).toBe("string");
    });


    it('should reject login if request is invalid', async () => {
        const response = await supertest(web).post("/api/auth/login").send({
            username: "",
            password: ""
        });

        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();
        
    });

    
});

describe('GET /api/auth/me', () => {

    beforeEach(async () => {
        await AuthTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
    })

    it('should be able to get current', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web).get("/api/auth/me").set("Authorization", `Bearer ${accessToken}`)

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("Admin")
        expect(response.body.data.name).toBe("Admin satu")

        console.log(response.body.data)
    })

    it('should reject get current if token is invalid', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web).get("/api/auth/me").set("Authorization", `Bearer ${accessToken}salah`)

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined()

        console.log(response.body.data)
    })

})

describe('PUT /api/auth/me', () => {
    
    beforeEach(async () => {
        await AuthTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
    })

    it('should reject update user if request is invalid', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                password: "",
                name: "",
            })

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();

    });

    it('should reject update user if token is wrong', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken} 1234`)
            .send({
                password: "Admin132",
                name: "Admin dua",
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();

    });

    it('should be able to update user name', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Admin dua",
            })

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("Admin dua");
    });

    it('should be able to update user password', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put("/api/auth/me")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                oldPassword: "Admin123",
                newPassword: "Admin132"
            })

        expect(response.status).toBe(200);
        
        const admin = await AuthTest.get();
        expect(await bcrypt.compare("Admin132", admin.passwordHash)).toBe(true);
    });


});

describe('POST /api/auth/logout', () => {
        
    beforeEach(async () => {
        await AuthTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
    })

    it('should be able to logout', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Logout successful");
    })

    it('should reject logout if token is wrong', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${accessToken} 1234`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();
    })
})