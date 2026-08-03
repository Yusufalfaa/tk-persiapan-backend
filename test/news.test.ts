import supertest from "supertest"
import { NewsTest } from "./utils/news-test.js"
import { web } from "../src/application/web.js"
import { AuthTest } from "./utils/auth-test.js"

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

describe('GET /api/admin/news', async () => {

    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to show admin news list', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .get("/api/admin/news")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);
    })

    it('should reject admin news list due to unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .get("/api/admin/news")
            .set("Authorization", `Bearer ${token}1234`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

})

describe('GET /api/admin/news/:id', async () => {

    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to show admin news detail', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .get("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("Berita 1");
    })

    it('should reject admin news detail unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .get("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}1234`);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should reject admin news detail not found', async () =>{
        const token = await AuthTest.getAccessToken()
        
        const response = await supertest(web)
            .get("/api/admin/news/4")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("News not found")
    })

})

describe('POST /api/admin/news', async () => {
    beforeEach(async () => {
        await AuthTest.create()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to create news', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Berita Agustus 2026"
            })

        expect(response.status).toBe(201);
        expect(response.body.data.title).toBe("Berita Agustus 2026");
    })

    it('should be reject to create news validation error', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "News"
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation error");
    })

    it('should be able to create news unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${token}1234`)
            .send({
                title: "Berita Agustus 2026"
            })

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

})

describe('PATCH /api/admin/news/:id', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to update news', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Berita Agustus 2026"
            })

        expect(response.status).toBe(200);
        expect(response.body.data.title).toBe("Berita Agustus 2026");
    })

    it('should be reject to update news validation error', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "News"
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation error");
    })

    it('should be able to update news unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}1234`)
            .send({
                title: "Berita Agustus 2026"
            })

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

})

describe('DELETE /api/admin/news/:id', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to delete news', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("News deleted successfully");
    })

    it('should not be able to delete news unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/1")
            .set("Authorization", `Bearer ${token}1234`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should not be able to delete news not found', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/4")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("News not found");
    })

})