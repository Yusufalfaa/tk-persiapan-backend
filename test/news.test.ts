import supertest from "supertest"
import { NewsTest } from "./utils/news-test.js"
import { web } from "../src/application/web.js"

describe('GET /api/news', async () => {

    beforeEach(async () => {
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to show news list', async () =>{
        const response = await supertest(web)
            .get("/api/news")

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    })

})

describe('GET /api/news/:slug', async () => {

    beforeEach(async () => {
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await NewsTest.deleteAll()
    })

    it('should be able to show news detail', async () =>{
        const response = await supertest(web)
            .get("/api/news/berita-1")

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("Berita 1");
    })

    it('should be reject to show not found news', async () =>{
        const response = await supertest(web)
            .get("/api/news/berita-3")

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("News not found")
    })

})