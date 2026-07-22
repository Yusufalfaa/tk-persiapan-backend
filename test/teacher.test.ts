import supertest from "supertest";
import { AuthTest, TeacherTest } from "./test-util.js"
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

describe('POST /api/teachers', () => {

    beforeEach(async () => {
        await AuthTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
        await TeacherTest.deleteAll();
    })

    it('should be able to create new teacher', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .post("/api/teachers")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Muhamad Yusuf",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });       

        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.name).toBe("Muhamad Yusuf");

    });

    it('should reject create new teacher due to invalid token', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .post("/api/teachers")
            .set("Authorization", `Bearer ${accessToken}1234`)
            .send({
                name: "Muhamad Yusuf",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });       

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should reject create new teacher due to invalid input', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .post("/api/teachers")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    })

})

describe('PUT /api/teachers/:id', () => {
    beforeEach(async () => {
        await AuthTest.create();
        await TeacherTest.create();
    })

    afterEach(async () => {
        await AuthTest.delete();
        await TeacherTest.deleteAll();
    })

    it('should be able to update teachers', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .put(`/api/teachers/1`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Muhamad Yusuf",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });       
        
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.name).toBe("Muhamad Yusuf");
    })

    it('should reject teacher update due to invalid token', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .put(`/api/teachers/1`)
            .set("Authorization", `Bearer ${accessToken}1234`)
            .send({
                name: "Muhamad Yusuf",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });       
        
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })

    it('should reject teacher not found', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .put(`/api/teachers/9999`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Muhamad Yusuf",
                position: "Guru Kelas B",
                photoPath: null,
                order: 1, 
            });       
        
        console.log(response.body)
        expect(response.status).toBe(404);
        expect(response.body.errors).toBe("Teacher not found");
    })

    it('should reject teacher update due to invalid input', async () => {
        const accessToken = await AuthTest.getAccessToken();
        
        const response = await supertest(web)
            .put(`/api/teachers/1`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Muhamad Yusuf",
                position: "",
                photoPath: null,
                order: 1, 
            });       
        
        console.log(response.body)
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});