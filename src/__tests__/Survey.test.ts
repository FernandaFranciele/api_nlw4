
import request from 'supertest';
import { app } from '../app';
import { getConnection } from 'typeorm';
import createConnection from '../database/';



describe("Surveys", async() => {
    beforeAll(async ()=>{
        const connection  = await createConnection();
        await connection.runMigrations();
    })

    afterAll(async() =>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new survey", async() =>{
        const response = await request(app).post("/surveys")
        .send({
            title: "title example", 
            description: "Descripton Example"
        })
       
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })
    
    it("Should be able to get all surveys", async() =>{
        await request(app).post("/surveys")
        .send({
            title: "title example2", 
            description: "Descripton Example2"
        })
       
        const response  =  await request(app).get("/surveys")
        
        expect(response.body.length).toBe(2);
    })
})
