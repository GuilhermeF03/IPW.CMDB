/*import request from "supertest";
import express from "express";
import { expect } from "chai";

import data from "../src/mem/cmdb-data-elastic.mjs";
import services from "../src/services/cmdb-services.mjs";
import webApi from "../src/web/api/cmdb-web-api.mjs";

const services = services(data);
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
app.delete("api/groups/:groupId/:movieId", webapi.deleteMovie);

describe("API Tests", () => {
    it("should get popular movies", () => {
        return request(app)
            .get("api/popular")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => expect(response.body).deep.equal({
                status: `Retrieved top 250 movies.`,
                movies: response.body.movies,
              }))
    });
});
*/
