import request from "supertest";
import express from "express";
import { expect } from "chai";

import data from '../test/movies/movies-data-mock.mjs'
import mem from "../src/mem/cmdb-data-elastic.mjs";
import servicesInit from "../src/services/cmdb-services.mjs";
import webApi from "../src/web/api/cmdb-web-api.mjs";

const services = servicesInit(data, mem);

const webapi = webApi(services);
const token = "276381264wgdgw72361-1";

const app = express();

app.use(express.json());

app.get("api/popular", webapi.getPopularMovies);
app.get("api/search/", webapi.searchMovie);
app.get("api/movie/:movieId", webapi.getMovieById);
// USER
app.post("api/users", webapi.createUser);
// GROUPS
app.get("api/groups", webapi.listGroups);
app.post("api/groups", webapi.createGroup);

app.get("api/groups/:groupId", webapi.getGroupById);
app.put("api/groups/:groupId", webapi.updateGroup);
app.delete("api/groups/:groupId", webapi.deleteGroup);

app.put("api/groups/:groupId/:movieId", webapi.addMovie);
app.delete("api/groups/:groupId/:movieId", webapi.deleteMovie); //pode não funcionar

describe("API Tests", () => {
    it("GET popular movies test", () => {
        return request(app)
            .get("api/popular")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Retrieved top 250 movies.`,
                movies: response.body.movies
              }))
    });

    it("GET search movie test", () => {
        //app.get("api/search/", webapi.searchMovie);
        return request(app)
            .get("api/search/")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Returned ${search.results.length} results for '${req.query.movieName}'.`,
                results: search.results,
              }))
    });

    it("GET movie by ID test", () => {
        //app.get("api/movie/:movieId", webapi.getMovieById);
        return request(app)
            .get("api/movie/:movieId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `<${movie.title}> successfully retrieved.`,
                "movie-info": movieInfo
              }))
    });

    it("POST create user test", () => {
        //app.post("api/users", webapi.createUser);
        return request(app)
            .post("api/users")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `User <${newUser.name}> was successfully created with token <${newUser.token}>`,
                "user-info": newUser
              }))
    });

    it("GET list of groups test", () => {
        //app.get("api/groups", webapi.listGroups);
        return request(app)
            .get("api/groups")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Returned all user's ${userGroups.length} groups`,
                "user-groups": userGroups
              }))
    });

    it("POST create group test", () => {
        //app.post("api/groups", webapi.createGroup);
        return request(app)
            .post("api/groups")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Group created with id: <${newGroup.id}>, name: <${newGroup.name}> and description: <${newGroup.description}>`,
                content: undefined
              }))
    });

    it("GET group by ID", () => {
        //app.get("api/groups/:groupId", webapi.getGroupById);
        return request(app)
            .get("api/groups/:groupId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `The group <${group.name}>, with id <${req.params.groupId}>, was successfully retrieved.`,
                "group-info": group
              }))
    });

    it("PUT update group test", () => {
        //app.put("api/groups/:groupId", webapi.updateGroup);
        return request(app)
            .put("api/groups/:groupId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Group with id <${req.params.groupId}> was successfully updated.`,
                "updated-info": updatedGroup
              }))
    });

    it("DELETE delete group test", () => {
        //app.delete("api/groups/:groupId", webapi.deleteGroup);
        return request(app)
            .delete("api/groups/:groupId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `${deletedGroup.name} was successfully removed from groups list.`,
                content: undefined
              }))
    });

    it("PUT add movie test", () => {
        //app.put("api/groups/:groupId/:movieId", webapi.addMovie);
        return request(app)
            .put("api/groups/:groupId/:movieId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `<${movieInfo.title}>, with id <${movieInfo.id}>, was successfully added to <${groupInfo.name}>.`,
                "movie-info": movieInfo
              }))
    });

    it("DELETE delete movie test", () => {
        //app.delete("api/groups/:groupId/:movieId", webapi.deleteMovie);
        return request(app)
            .delete("api/groups/:groupId/:movieId")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `${deletedMovie.title} was successfully removed from <${deletedMovie.group.name}>.`
              }))
    });
        
});

