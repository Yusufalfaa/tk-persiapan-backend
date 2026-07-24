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

describe('POST /api/admin/news', () => {
    beforeEach(async () => {
        await AuthTest.create()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })
    
    it('should be create new news', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Pendaftaran Siswa Baru",
                isPublished: false,
            })

        expect(response.status).toBe(201)
        expect(response.body.data.title).toBe("Pendaftaran Siswa Baru");
    })

    it('should reject bad request', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "",
                isPublished: false,
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Validation error");
    })

    it('should be reject create due to unauthorized', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/news")
            .set("Authorization", `Bearer ${accessToken}1234`)
            .send({
                title: "Pendaftaran Siswa Baru",
                isPublished: false,
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Unauthorized");
    })
    
})

describe('PATCH /api/admin/news', () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createDraftNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })
    
    it('should be update news', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .patch("/api/admin/news/3")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "Pendaftaran Siswa Baru",
                isPublished: true,
            })

        expect(response.status).toBe(200)
        expect(response.body.data.title).toBe("Pendaftaran Siswa Baru");
    })

    it('should reject update bad request', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .patch("/api/admin/news/3")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                title: "",
                isPublished: false,
            })

        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Validation error");
    })

    it('should reject update due to unauthorized', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .patch("/api/admin/news/3")
            .set("Authorization", `Bearer ${accessToken}1234`)
            .send({
                title: "Pendaftaran Siswa Baru",
                isPublished: false,
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toBe("Unauthorized");
    })
    
})