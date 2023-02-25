// import request from "supertest";
// import express from "express";
// import { expect } from "chai";

// import data from "../src/mem/cmdb-data-elastic.mjs";
// import services from "../src/services/cmdb-services.mjs";
// import webApi from "../src/web/api/cmdb-web-api.mjs";
// import { app } from "../src/cmdb-server.mjs";
// import { randomUUID } from "crypto";
// import { doesNotMatch } from "assert";


// let testUserToken = undefined;
// let testGroup = { name: "testGroup", description: "testDescription" };
// let testMovie = { id: 'tt1630029' }

// describe("Create User", () => {
//     it("should create a new user", () => {
//         const user = {
//             username: "username",
//             password: "password",
//         }

//         return request(app)
//             .post("/api/signup")
//             .set('Accept', 'application/json')
//             .send(user)
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .then(response => {
//                 expect(response.body.status).equal("User was successfully created")
//                 testUserToken = response.body.token;
//             })
           
//     });
// });
    
// describe("Get Top Movies", () => {
//     it("should get popular movies", () => {
//         return request(app)
//             .get("/api/popular")
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => {
//                 expect(response.body).deep.equal({
//                     status: `Retrieved top 250 movies.`,
//                     movies: response.body.movies,
//                 })
//             })
//     });
// });

// describe("Search Movies", () => {
//     it("should search movies", async function(){
//         this.timeout(1000000)
//         await request(app)
//             .get("/api/search?movieName=avatar")
//             .set('Accept', 'application/json')
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body.hasOwnProperty('results')).to.be.true)
//     })
// });

// describe("Get Movie By Id", () => {
//     it("should get a movie", () => {
//         return request(app)
//             .get("/api/movie/" + testMovie.id)
//             .expect('Content-Type', /json/)
//             .expect(200)

//     });
// });

// describe("Create Group", () => {
//     it("should create a new group", () => {
//         return request(app)
//             .post("/api/groups")
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .send(testGroup)
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .then(response => {
//                 expect(response.body).deep.equal({
//                     status: `Group was successfully created`
//                 })
//                 testGroup = response.body;
//             })         
//     });
// });

// describe("Get Group", () => {
//     it("should get a group", () => {
//         return request(app)
//             .get("/api/groups/" + testGroup.id)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body.hasOwnProperty(results)).to.be.true)
//     });
// });
    
// describe("List Groups", () => {
//     it("should list all groups", () => {
//         return request(app)
//             .get("/api/groups/" + testGroup.id)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body.hasOwnProperty(results)).to.be.true)
//     });
// });

// describe("Update Group", () => {
//     it("should update a group", () => {
//         return request(app)
//             .put("/api/groups/" + testGroup.id)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .send(testGroup)
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body).deep.equal({
//                 status: `Group was successfully updated`
//             }))
//     });
// });
    

// describe("Add Movie To Group", () => {
//     it("should add a movie to a group", () => { 
//         return request(app)
//             .put(`/api/groups/${testGroup.id}/${testMovie.id}`)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .send(testMovie)
//             .expect('Content-Type', /json/)
//             .expect(201)
//             .then(response => expect(response.body).deep.equal({
//                 status: `Movie was successfully added to group`
//             }))
//     })
// });

// describe("Delete Movie From Group", () => {
//     it("should delete a movie from a group", () => {
//         return request(app)
//             .delete(`/api/groups/${testGroup.id}/${testMovie.id}`)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body).deep.equal({
//                 status: `Movie was successfully removed from group`
//             }))
//     });
// });

    
// describe("Delete Group", () => {

//     it("should delete a group", () => {
//         return request(app)
//             .delete("/api/groups/" + testGroup.id)
//             .set('Accept', 'application/json')
//             .set('Authorization', `Bearer ${testUserToken}`)
//             .expect('Content-Type', /json/)
//             .expect(200)
//             .then(response => expect(response.body).deep.equal({
//                 status: `Group was successfully deleted`
//             }))         
//     });
// });

