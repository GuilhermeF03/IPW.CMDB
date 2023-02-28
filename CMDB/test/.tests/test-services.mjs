import assert from "assert";
import mem from "../src/mem/cmdb-data-mem.mjs";
import data from "../test/movies/movies-data-mock.mjs";
import servicesInit from "../src/services/cmdb-services.mjs";


const services = servicesInit(data, mem);

let testUserToken = undefined;
let testGroupId = undefined;

describe("Create User", () => {
  it("should create a user", async () => {
    const testUser = {
      username: "test",
      password: "test",
    };
    const user = await services.createUser(testUser);
    assert.notEqual(user.token, undefined);
    testUserToken = user.token;
  });
});

describe("Get Top Rated Movies", () => {
  it("should get top movies", async () => {
    const limit = 10;
    const movies = await services.getPopularMovies(limit);
    assert.notEqual(movies, undefined);
    assert.equal(movies.length, 10);
  });
});

describe("Get Movie", () => {
  it("should get a movie", async () => {
    const movieId = "tt1630029";
    const movie = await services.getMovieById(movieId);
    assert.notEqual(movie, undefined);
    assert.equal(movie.id, "tt1630029");
    assert.equal(movie.title, "Avatar: The Way of Water");
  });
});

describe("Search Movie", () => {
  it("should search a movie", async () => {
    const query = "avatar";
    const limit = 5;
    const results = await services.searchMovie(query, limit);
    assert.notEqual(results, undefined);
    assert.equal(results.length, 5);
  });
});

describe("Create Group", () => {
  it("should create a group", async () => {
    const testGroup = {
      name: "test",
      description: "test",
    };
    const group = await services.createGroup(testUserToken, testGroup);
    assert.notEqual(group, undefined);
    assert.equal(group.name, testGroup.name);
    assert.equal(group.description, testGroup.description);
    testGroupId = group.id;
  });
});

describe("List All User Groups", () => {
  it("should list all user groups", async () => {
    const groups = await services.listUserGroups(testUserToken);
    assert.notEqual(groups, undefined);
    assert.equal(groups.length, 1);
  });
});

describe("Get Group By Id", () => {
  it("should get a group by id", async () => {
    const group = await services.getGroupById(testUserToken, testGroupId);
    assert.notEqual(group, undefined);
    assert.equal(group.id, testGroupId);
    assert.equal(group.name, "test");
    assert.equal(group.description, "test");
  });
});

describe("Update Group", () => {
  it("should update a group", async () => {
    const testGroup = {
      name: "test2",
      description: "test2",
    };
    const group = await services.updateGroup(testUserToken, testGroupId, testGroup);
    assert.notEqual(group, undefined);
    assert.equal(group.name, testGroup.name);
    assert.equal(group.description, testGroup.description);
  });
});

describe("Add Movie To Group", () => {
  it("should add a movie to a group", async () => {
    const movieId = "tt1630029";
    const movie = await services.addMovie(testUserToken, testGroupId, movieId);
    assert.notEqual(movie, undefined);
    assert.equal(movie.id, movieId);
  });
});

describe("Delete Movie From Group", () => {
  it("should delete a movie from a group", async () => {
    const movieId = "tt1630029";
    const movie = await services.deleteMovie(testUserToken, testGroupId, movieId);
    assert.notEqual(movie, undefined);
    assert.equal(movie.id, movieId);
  });
});
  
describe("Delete Group", () => {
  it("should delete a group", async () => {
    const group = await services.deleteGroup(testUserToken, testGroupId);
    assert.notEqual(group, undefined);
    assert.equal(group.id, testGroupId);
  });
});
