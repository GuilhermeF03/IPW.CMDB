import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

/* ---------------------- [USER] -------------------------------------------------------------------------------------------------------- */
function createUser(userInfo) {
  return fetch(baseURL + `users/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).then((response) => response.json());
}

/* ---------------------- [GROUP] -------------------------------------------------------------------------------------------------------- */
function createGroup(userToken, groupInfo) {
  return fetch(baseURL + `groups/_doc?refresh=wait_for`, {
      method: "POST",
      body: JSON.stringify({
        userId: userToken,
        name: groupInfo.name,
        description: groupInfo.description,
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then(result => result = {id: result._id, name: groupInfo.name, description: groupInfo.description,})
}

function listUserGroups(userToken) {
  return fetch(baseURL + `groups/_search?q=userId:"${userToken}"`, {
    headers: { Accept: "application/json" },
  })
    .then((response) => response.json())
    // filter properties
    .then(async (body) => 
    {
      let hits = body.hits.hits; // search results
      let array = [];
      for (const i in hits) {
        let moviesInfo = await getGroupMoviesInfo(hits[i]._id);
        let tmp = { id : hits[i]._id, name : hits[i]._source.name, description: hits[i]._source.description };
        hits[i] = {
          id : tmp.id,
          name : tmp.name,
          description: tmp.description, 
          "number of movies" : moviesInfo.numberOfMovies, 
          "total duration" : moviesInfo.totalDuration};
      }  
      return hits;
    });
}

function getGroupById(userToken, groupId) {
  return fetch(baseURL + `groups/_doc/${groupId}`)
    .then((response) => response.json())
    .then(async (body) => {
      let moviesInfo = await getGroupMoviesInfo(groupId);
      return {
        id: body._id,
        name: body._source.name,
        description: body._source.description,
        "number of movies": moviesInfo.numberOfMovies,
        "total duration": moviesInfo.totalDuration,
        movies: moviesInfo.movies,
      };
    });
}

function updateGroup(userToken, groupId, updateInfo) {
  return fetch(baseURL + `groups/_doc/${groupId}`, {
    method: "PUT",
    body: JSON.stringify({
      userId: userToken,
      name: updateInfo.name,
      description: updateInfo.description,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },})
    .then((response) => response.json())
    .then((body) => body = {status: body.result, name: updateInfo.name, description: updateInfo.description,});
}

function deleteGroup(userToken, groupId) {
  return fetch(baseURL + `groups/_doc/${groupId}`, { method: "DELETE" })
    .then((response) => response.json())
    .then(result => result = {status: result.result, groupId: groupId})
    .then(removeGroupMovies(groupId));
}

/* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
function addMovie(userToken, groupId, movieInfo) {
  return fetch(baseURL + `movies/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify({
      groupId: groupId,
      id: movieInfo.id,
      title: movieInfo.title,
      description: movieInfo.description,
      runtime: movieInfo.runtimeMins,
      year: movieInfo.year,
      image: movieInfo.image,
      directors: movieInfo.directors,
      actors: movieInfo.actors,
    }),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .then((body) =>
        body = {
          status: body.result,
          id: body._id,
          title: movieInfo.title,
          description: movieInfo.description,
          runtime: movieInfo.runtimeMins,
          year: movieInfo.year,
          image: movieInfo.image,
          directors: movieInfo.directors,
          actors: movieInfo.actors,
        }
    );
}

function getMovieById(movieId) {
  return fetch(baseURL + `movies/_doc/${movieId}`)
    .then((response) => response.json())
    .then((body) => body._source);
}


function deleteMovie(userToken, groupId, movieId) {
  return fetch(baseURL + `movies/_doc/${movieId}`, { method: "DELETE" }).then(
    (response) => response.json()
  );
}
/* --------------------- [AUX] ---------------------------------------------------------------------------------------------------- */

// Get all <groupId> movies
function getGroupMoviesInfo(groupId) {
  return fetch(baseURL + `movies/_search?q=groupId:"${groupId}"`)
    .then((response) => response.json())
    .then((body) => {
      let totalDuration = 0;
      let movies = body.hits.hits.map((hits) => hits._source);
      for (const mov in movies) {
        totalDuration += movies[mov].runtime;
      }
      return {
        movies: movies.map((movie) => movie = {id: movie.id, title: movie.title, image: movie.image}),
        numberOfMovies: body.hits.total.value,
        totalDuration: totalDuration,
      };
    });
}

function removeGroupMovies(groupId) {
  return fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"`, {
    method: "POST",
  }).then((response) => response.json());
}
//-----------------------------------------------------------------------------------------------------------------------------------

export default {
  createUser,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
};
