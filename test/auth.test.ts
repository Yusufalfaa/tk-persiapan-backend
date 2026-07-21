import supertest from "supertest";
import { web } from "../src/application/web.js"
import { logger } from "../src/application/logging.js";
import { AuthTest } from "./test-util.js";
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
        expect(response.body.errors).toBeDefined();
        
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
        expect(response.body.errors).toBeDefined()

        console.log(response.body.data)
    })

})