import supertest from "supertest";
import { TeacherTest } from "./test-util.js"
import { web } from "../src/application/web.js";

describe('GET /api/teachers', () => {
    
    beforeEach(async () => {
        await TeacherTest.create();
    })

    afterEach(async () => {
        await TeacherTest.deleteAll();
    })

    it('should be able to get teacher list', async () => {
        const response = await supertest(web)
            .get("/api/teachers")

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data[0].name).toBe("Ibu Sri Wahyuni");

    });

})