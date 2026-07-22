import supertest from "supertest";
import { SchoolTest } from "./test-util.js"
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";

describe('GET /api/school', () => {
    beforeEach(async () => {
        await SchoolTest.create();
    })

    afterEach(async () => {
        await SchoolTest.delete();
    })

    it('should be able get school profile', async () => {
        const school = SchoolTest.get();
        const response = await supertest(web)
            .get("/api/school")

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.name).toBe("TK Persiapan");
        console.log(response.body)
        console.log(JSON.stringify(response.body.data.missions, null, 2));
    })

})