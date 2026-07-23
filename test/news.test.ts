import supertest from "supertest";
import { NewsTest } from "./test-util.js";
import { web } from "../src/application/web.js";

describe('GET /api/news', () => {
    beforeEach(async () => {
        await NewsTest.create();
    })

    afterEach(async () => {
        await NewsTest.deleteAll();
    })

    it('should be able to get news list', async () => {
        const response = await supertest(web)
            .get("/api/news?page=1&size=10")

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    })

})