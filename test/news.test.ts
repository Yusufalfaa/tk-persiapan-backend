import supertest from "supertest"
import { NewsTest } from "./test-util.js"
import { web } from "../src/application/web.js"

describe('GET /api/news', () => {

    beforeEach(async () => {
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to get news list', async () => {
        const response = await supertest(web)
            .get("/api/news?page=1&size=10")

        console.log(response.body.data)
        expect(response.status).toBe(200)
        expect(Array.isArray(response.body.data)).toBe(true);
    }) 

})

describe('GET /api/news/:slug', () => {

    beforeEach(async () => {
        await NewsTest.createWithSections()
        await NewsTest.createSecondNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to get news detail', async () => {
        const response = await supertest(web)
            .get("/api/news/lomba-tk-2026")

        console.log(response.body.data)
        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("Lomba TK 2026");
    }) 

    it('should reject get news detail', async () => {
        const response = await supertest(web)
            .get("/api/news/lomba-tk-2025")

        console.log(response.body.data)
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("News not found");
    }) 

})