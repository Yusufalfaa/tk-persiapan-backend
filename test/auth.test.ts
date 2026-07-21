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