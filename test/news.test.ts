import supertest from "supertest"
import { AuthTest, NewsTest } from "./test-util.js"
import { web } from "../src/application/web.js"

describe('GET /api/news', () => {

    beforeEach(async () => {
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
        await NewsTest.createDraftNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to get news list', async () => {
        const response = await supertest(web)
            .get("/api/news?page=1&size=10")

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true);
    }) 

})

describe('GET /api/news/:slug', () => {

    beforeEach(async () => {
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
        await NewsTest.createDraftNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to get news detail', async () => {
        const response = await supertest(web)
            .get("/api/news/lomba-tk-2026")

        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("Lomba TK 2026");
    }) 

    it('should reject get news detail due to not found', async () => {
        const response = await supertest(web)
            .get("/api/news/lomba-tk-2025")

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("News not found");
    }) 

    it('should reject get unpublished news detail', async () => {
        const response = await supertest(web)
            .get("/api/news/outing-class-2026")

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("News not found");
    }) 

})

describe('GET /api/admin/news', () => {

    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
        await NewsTest.createDraftNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to get news list', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/news?page=1&size=10")
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true);
    }) 

})

describe('GET /api/admin/news/:slug', () => {

    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
        await NewsTest.createDraftNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to get news detail', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/news/lomba-tk-2026")
            .set("Authorization", `Bearer ${accessToken}`)

        console.log(response.body)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("Lomba TK 2026");
    }) 

    it('should reject get news detail due to not found', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/news/lomba-tk-2025")
            .set("Authorization", `Bearer ${accessToken}`)

        expect(response.status).toBe(404)
        expect(response.body.message).toBe("News not found");
    }) 

    it('should reject get news detail due to unauthorized', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .get("/api/admin/news/lomba-tk-2025")
            .set("Authorization", `Bearer ${accessToken}1234`)

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Unauthorized");
    }) 
})