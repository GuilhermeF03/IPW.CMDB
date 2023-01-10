import assert from "node:assert/strict";
import mem from "../src/mem/cmdb-data-elastic.mjs";

const baseURL = "http://localhost:9200/";
const userToken = "276381264wgdgw72361-1";


async function createDummyGroup() {
  let groupInfo = { name: "testGroup", description: "testDescription" };
  return await mem.createGroup(userToken, groupInfo);
}

async function createDummyMovie() {
    let movieInfo = {
        id: "testMovieId",
        title: "testMovie",
        description: "testDescription",
        runtime: 100,
        year: 2021,
        image: "testImage",
        directors: "testDirector",
        actors: "testActor",
      };
  return await mem.addMovie(userToken, 1, movieInfo);
}

/*describe("CMDB Data Elastic Tests", () => {
  
  describe("#createUser Tests", () => {
    it("Should create a user", async () => {
      let userInfo = { name: "testUser", token: userToken };
      let user = await mem.createUser(userInfo);

      let response = await fetch(baseURL + `users/_doc/${user._id}`);
      let body = await response.json();
      assert.deepEqual(body._source, userInfo);

      await fetch(baseURL + `users/_doc/${user._id}`, { method: "DELETE" });
    });
  });

  describe("#createGroup Tests", () => {
    let groupInfo = { name: "testGroup", description: "testDescription" };

    it("The output must have the same name and description as the info passed in parameter", async () => {
      let group = await mem.createGroup(userToken, groupInfo);
      groupInfo = {
        id: group.id,
        name: groupInfo.name,
        description: groupInfo.description,
      };
      assert.deepEqual(group, groupInfo);
    });
    it("Should create a group", async () => {
      let response = await fetch(baseURL + `groups/_doc/${groupInfo.id}`);
      let body = await response.json();
      body = {
        id: body._id,
        name: body._source.name,
        description: body._source.description,
      };
      assert.deepEqual(body, groupInfo);
      await fetch(baseURL + `groups/_doc/${body.id}`, { method: "DELETE" });
    });
  });

  describe("#getGroupById Tests", () => {
    it("Get the correct group", async () => {
      let group = await createDummyGroup();
      let groupInfo = await mem.getGroupById(userToken, group.id);
      let groupInfoTest = {
        id: group.id,
        name: groupInfo.name,
        description: groupInfo.description,
        "number of movies": 0,
        "total duration": 0,
        movies: [],
      };
      assert.deepEqual(groupInfo, groupInfoTest);
      await fetch(baseURL + `groups/_doc/${group.id}`, { method: "DELETE" });
    });
  });

  describe("#updateGroup Tests", () => {
    let group;
    let groupInfoTest;
    let updateInfo = { name: "testGroup2", description: "testDescription2" };

    it("Should gave the right output", async () => {
      group = await createDummyGroup();

      groupInfoTest = await mem.updateGroup(userToken, group.id, updateInfo);

      updateInfo = {
        status: "updated",
        name: updateInfo.name,
        description: updateInfo.description,
      };
      assert.deepEqual(groupInfoTest, updateInfo);
    });
    it("Should update the group in Data Base", async () => {
      groupInfoTest = await mem.getGroupById(userToken, group.id);
      updateInfo = {
        id: group.id,
        name: updateInfo.name,
        description: updateInfo.description,
        "number of movies": 0,
        "total duration": 0,
        movies: [],
      };
      assert.deepEqual(groupInfoTest, updateInfo);

      await fetch(baseURL + `groups/_doc/${group.id}`, { method: "DELETE" });
    });
  });

  describe("#deleteGroup Tests", () => {
    it("Should delete the group", async () => {
      let group = await createDummyGroup();
      let groupInfo = await mem.deleteGroup(userToken, group.id);
      let groupInfoTest = {
        status: "deleted",
        groupId: group.id,
      };
      assert.deepEqual(groupInfo, groupInfoTest);
    });
  });

  describe("#addMovie Tests", () => {
    let group;
    let movie;
    let movieInfo = {
      id: "testMovieId",
      title: "testMovie",
      description: "testDescription",
      runtimeMins: 100,
      year: 2021,
      image: "testImage",
      directors: "testDirector",
      actors: "testActor",
    };
    it("Should gave the right output", async () => {
      group = await createDummyGroup();

      movie = await mem.addMovie(userToken, group.id, movieInfo);
      let movieInfoTest = {
        status: "created",
        id: movie.id,
        title: movieInfo.title,
        description: movieInfo.description,
        runTime: movieInfo.runtimeMins,
        year: movieInfo.year,
        image: movieInfo.image,
        directors: movieInfo.directors,
        actors: movieInfo.actors,
      };
      assert.deepEqual(movie, movieInfoTest);
    });
    it("Should add the movie", async () => {
      let movieInfoTest = await (
        await fetch(baseURL + `movies/_doc/${movie.id}`)
      ).json();
      movieInfoTest = {
        id: movieInfoTest._source.id,
        title: movieInfoTest._source.title,
        description: movieInfoTest._source.description,
        runTime: movieInfoTest._source.runTime,
        year: movieInfoTest._source.year,
        image: movieInfoTest._source.image,
        directors: movieInfoTest._source.directors,
        actors: movieInfoTest._source.actors,
      };
      movieInfo = {
        id: movieInfo.id,
        title: movieInfo.title,
        description: movieInfo.description,
        runTime: movieInfo.runtimeMins,
        year: movieInfo.year,
        image: movieInfo.image,
        directors: movieInfo.directors,
        actors: movieInfo.actors,
      };
      assert.deepEqual(movieInfo, movieInfoTest);

      await fetch(baseURL + `groups/_doc/${group.id}`, { method: "DELETE" });
      await fetch(baseURL + `movies/_doc/${movie.id}`, { method: "DELETE" });
    });
  });
    describe("#deleteMovie Tests", () => { 
        it("Should delete the movie", async () => { 
            let group = await createDummyGroup(); 
            let movie = await createDummyMovie(group.id); 
            let movieInfo = await mem.deleteMovie(userToken, group.id, movie.id); 
            assert.deepEqual("deleted", movieInfo.result); 
            await fetch(baseURL + `groups/_doc/${group.id}`, { method: "DELETE" });
            await fetch(baseURL + `movies/_doc/${movie.id}`, { method: "DELETE" });
        });
    })

  describe("#listUserGroups Tests", () => {
    it("Should list the groups", async () => {
      let group = await createDummyGroup();
      let groupInfo = await mem.listUserGroups(userToken);
      let groupInfoTest = [
        {
          id: group.id,
          name: "testGroup",
          description: "testDescription",
          "number of movies": 0,
          "total duration": 0,
        },
      ];
      assert.deepEqual(groupInfo, groupInfoTest);
      await fetch(baseURL + `groups/_doc/${group.id}`, { method: "DELETE" });
    });
  });
});*/
