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
            .get("/api/admin/news/999")
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
            .delete("/api/admin/news/999")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("News not found");
    })

})

describe('POST /api/admin/news/:newsId/sections', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to create news section TEXT ', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "TEXT")
            .field(
                "text",
                "Ini adalah isi section baru yang panjangnya lebih dari sepuluh karakter."
            );
            
        expect(response.status).toBe(201);
        expect(response.body.data.sections[1].type).toBe("TEXT");
    })

    it('should be able to create news section YOUTUBE ', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "YOUTUBE")
            .field(
                "youtubeUrl",
                "https://www.youtube.com/watch?v=1is1PwQKo8w"
            );
        
        expect(response.status).toBe(201);
        expect(response.body.data.sections[2].type).toBe("YOUTUBE");
    })

    it('should be able to create news section IMAGE ', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "IMAGE")
            .attach("image", "test/resources/news.webp");
            
        expect(response.status).toBe(201);
        expect(response.body.data.sections[2].type).toBe("IMAGE");
    })
    it('should be reject new section due invalid 1', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "IMAGE")
            .attach("image", "test/resources/news.webp")
            .attach("image", "test/resources/news.webp")

        expect(response.status).toBe(400);
    })

    it('should be reject new section due invalid 2', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "TEXT")
            .field(
                "youtubeUrl",
                "https://www.youtube.com/watch?v=1is1PwQKo8w"
            );
            
        expect(response.status).toBe(400);
    })

    it('should be reject to create news section due to unauthorized ', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/1/sections")
            .set("Authorization", `Bearer ${token}1234`)
            .field("type", "TEXT")
            .field(
                "text",
                "Ini adalah isi section baru yang panjangnya lebih dari sepuluh karakter."
            );
            
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should be reject to create news section due to news not found ', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .post("/api/admin/news/999/sections")
            .set("Authorization", `Bearer ${token}`)
            .field("type", "TEXT")
            .field(
                "text",
                "Ini adalah isi section baru yang panjangnya lebih dari sepuluh karakter."
            );
            
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("News not found");
    })

    it('should sanitize malicious script tag from text section', async () => {
        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post(`/api/admin/news/1/sections`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                type: "TEXT",
                text: "Halo semua <script>alert('hacked')</script> selamat datang"
            });

        console.log(response.body.data.sections)
        expect(response.status).toBe(201);
        
        const newSection = response.body.data.sections.at(-1);
        expect(newSection.text).not.toContain("<script>");
        expect(newSection.text).toContain("Halo semua");
    });
})

describe('PATCH /api/admin/news/sections/:sectionId', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to update news section TEXT', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/1")
            .set("Authorization", `Bearer ${token}`)
            .field(
                "text",
                "Ini adalah section yang udah diupdate"
            );
            
        console.log(response.body.data.sections);
        expect(response.status).toBe(200);
        expect(response.body.data.sections[0].text).toBe("Ini adalah section yang udah diupdate");
    })

    it('should be able to update news section IMAGE', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/2")
            .set("Authorization", `Bearer ${token}`)
            .attach("image", "test/resources/news.webp");
            
        expect(response.status).toBe(200);
        expect(response.body.data.sections[0].imagePath).toBeDefined();
    })

    it('should be able to update news section YOUTUBE', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/3")
            .set("Authorization", `Bearer ${token}`)
            .field("youtubeUrl", "https://youtu.be/QDia3e12czc?si=urU03BVXjwbNVyEh");
    
        expect(response.status).toBe(200);
        expect(response.body.data.sections[0].youtubeUrl).toBeDefined();
    })

    it('should reject due to unauthorized', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/1")
            .set("Authorization", `Bearer ${token}1234`)
            .field(
                "text",
                "Ini adalah section yang udah diupdate"
            );

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should reject due to section not found', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/999")
            .set("Authorization", `Bearer ${token}`)
            .field(
                "text",
                "Ini adalah section yang udah diupdate"
            );

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Section not found");
    })
})

describe('DELETE /api/admin/news/sections/:sectionId', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to delete news section', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/sections/1")
            .set("Authorization", `Bearer ${token}`)

        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Section deleted successfully");
    })

    it('should not be able to delete news section unauthorized', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/sections/1")
            .set("Authorization", `Bearer ${token}1234`)

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should not be able to delete news section not found', async () =>{
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .delete("/api/admin/news/sections/999")
            .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Section not found");
    })

})

describe('PATCH /api/admin/news/sections/:sectionId/move', async () => {
    beforeEach(async () => {
        await AuthTest.create()
        await NewsTest.createNews()
    })

    afterEach(async () => {
        await AuthTest.delete()
        await NewsTest.deleteAll()
    })

    it('should be able to move news section UP', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/4/move")
            .set("Authorization", `Bearer ${token}`)
            .send({direction: "UP"})

        expect(response.status).toBe(200);
    })

    it('should be able to move news section DOWN', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/1/move")
            .set("Authorization", `Bearer ${token}`)
            .send({direction: "DOWN"})

        expect(response.status).toBe(200);
    })

    it('should not move section DOWN if already last', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/4/move")
            .set("Authorization", `Bearer ${token}`)
            .send({
                direction: "DOWN"
            });

        expect(response.status).toBe(200);

        expect(response.body.data.sections).toEqual([
            expect.objectContaining({
                id: 1,
                order: 0
            }),
            expect.objectContaining({
                id: 4,
                order: 1
            })
        ]);
    });

    
    it('should reject move section due to unauthorized', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/4/move")
            .set("Authorization", `Bearer ${token}1234`)
            .send({direction: "UP"})
            
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Unauthorized");
    })

    it('should reject move section due to not found', async () => {
        const token = await AuthTest.getAccessToken()

        const response = await supertest(web)
            .patch("/api/admin/news/sections/999/move")
            .set("Authorization", `Bearer ${token}`)
            .send({direction: "UP"})
            
        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Section not found");
    })

})