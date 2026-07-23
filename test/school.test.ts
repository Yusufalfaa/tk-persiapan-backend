import supertest from "supertest";
import { AuthTest, SchoolTest } from "./test-util.js"
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import { toSchoolProfileUpdateRequest } from "../src/models/school-model.js";

describe('GET /api/school', () => {
    beforeEach(async () => {
        await SchoolTest.create();
    })

    afterEach(async () => {
        await SchoolTest.delete();
    })

    it('should be able get school profile', async () => {
        const response = await supertest(web)
            .get("/api/school")

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(1);
        expect(response.body.data.name).toBe("TK Persiapan");
    })

})

describe('PUT /api/school', () => {

    beforeEach(async () => {
        await AuthTest.create();
        await SchoolTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
        await SchoolTest.delete();
    })

    it('should be able to update school name', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const school = await SchoolTest.get();

        const request = toSchoolProfileUpdateRequest(school);

        request.name = "TK Persiapan Updated";

        const response = await supertest(web)
            .put("/api/admin/school")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(request);

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("TK Persiapan Updated");
    });

    it('should reject update school due to invalid name/input', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const school = await SchoolTest.get();

        const request = toSchoolProfileUpdateRequest(school);

        request.name = "TK";

        const response = await supertest(web)
            .put("/api/admin/school")
            .set("Authorization", `Bearer ${accessToken}`)
            .send(request);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject update school if token is invalid', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const school = await SchoolTest.get();

        const request = toSchoolProfileUpdateRequest(school);

        request.name = "TK Persiapan Updated";

        const response = await supertest(web)
            .put("/api/admin/school")
            .set("Authorization", `Bearer ${accessToken} 1234`)
            .send(request);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})