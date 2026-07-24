import supertest from "supertest";
import { TeacherTest } from "./utils/teacher-test.js"
import { AuthTest } from "./utils/auth-test.js";
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
            .get("/api/teachers?page=1&size=10")

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true);

    });

})

describe('GET /api/teachers/:id', () => {
    
    beforeEach(async () => {
        await TeacherTest.create();
    })

    afterEach(async () => {
        await TeacherTest.deleteAll();
    })

    it('should be able to get teacher by id', async () => {
        const response = await supertest(web)
            .get("/api/teachers/1")

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("Ibu Sri Wahyuni");

    });

    it('should reject due to not found', async () => {
        const response = await supertest(web)
            .get("/api/teachers/3")

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Teacher not found");

    });

})

describe('POST /api/admin/teachers', () => {

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
            .post("/api/admin/teachers")
            .set("Authorization", `Bearer ${accessToken}`)
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1")
            .attach(
                "photo",
                "test/resources/teacher.jpg"
            );


        expect(response.status).toBe(201);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.name)
            .toBe("Muhamad Yusuf");

        expect(response.body.data.photoPath).toBeDefined();

    });


    it('should reject create new teacher due to invalid token', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/teachers")
            .set(
                "Authorization",
                `Bearer ${accessToken}invalid`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1");


        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();

    });


    it('should reject create new teacher due to invalid input', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/teachers")
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "")
            .field("position", "Guru Kelas B")
            .field("order", "1")
            .attach(
                "photo",
                "test/resources/teacher.jpg"
            );


        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();

    });


    it('should reject create new teacher without photo', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .post("/api/admin/teachers")
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1");


        expect(response.status).toBe(201);
        expect(response.body.data.photoPath).toBeNull();

    });


});

describe('PUT /api/admin/teachers/:id', () => {

    beforeEach(async () => {
        await AuthTest.create();
        await TeacherTest.create();
    })


    afterEach(async () => {
        await AuthTest.delete();
        await TeacherTest.deleteAll();
    })


    it('should be able to update teacher without photo', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1");


        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.name).toBe("Muhamad Yusuf");

    });


    it('should be able to update teacher with new photo', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1")
            .attach(
                "photo",
                "test/resources/teacher.jpg"
            );


        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.photoPath).toBeDefined();

    });


    it('should reject teacher update due to invalid token', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}1234`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1");


        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();

    });


    it('should reject teacher not found', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put(`/api/admin/teachers/9999`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "Guru Kelas B")
            .field("order", "1");


        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Teacher not found");

    });


    it('should reject teacher update due to invalid input', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .put(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            )
            .field("name", "Muhamad Yusuf")
            .field("position", "")
            .field("order", "1");


        expect(response.status).toBe(400);
        expect(response.body.message).toBeDefined();

    });

});

describe('DELETE /api/admin/teachers/:id', () => {

    beforeEach(async () => {
        await AuthTest.create();
        await TeacherTest.create();
    })


    afterEach(async () => {
        await AuthTest.delete();
        await TeacherTest.deleteAll();
    })


    it('should be able to delete teacher by id', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .delete(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            );


        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();

    });


    it('should reject delete teacher due to invalid token', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .delete(`/api/admin/teachers/1`)
            .set(
                "Authorization",
                `Bearer ${accessToken}1234`
            );


        expect(response.status).toBe(401);
        expect(response.body.message).toBeDefined();

    });


    it('should reject delete teacher not found', async () => {

        const accessToken = await AuthTest.getAccessToken();

        const response = await supertest(web)
            .delete(`/api/admin/teachers/9999`)
            .set(
                "Authorization",
                `Bearer ${accessToken}`
            );

        expect(response.status).toBe(404);
        expect(response.body.message).toBeDefined();

    });

});