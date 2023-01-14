import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

// // checks for indexes at elastic -> add missing indexes
// async function startupRoutine(){
//   try{
//     const json = await((await fetch('http://localhost:9200/_cat/indices?format=json')).json());
//     let indices = await json.map((i => i.index));
//     console.log(indices)
//     const mandatory =['groups','users','movies']; // mandatory indexes

//     mandatory.forEach(
//       async idx => {
//           if(!indices.includes(idx))
//             await fetch(`http://localhost:9200/${idx}`,{ method: 'PUT'}); // add index
//       });
//   }catch(error) {
//     console.error(error)
//   }
// }
// // called at boot time
// startupRoutine();

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

function validateUser(username, password) {
  return fetch(baseURL + `users/_search?q=username:${username}`)
  .then(resp => resp.json())
  .then(res => res.hits.hits.map(hits => hits._source)[0])
  .then(user => {return (user.password == password)? {token:user.token} : Promise.reject()})
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
      if( body.status == 404) return []
      let bodyInfo = body.hits.hits; // search results
      //let array = [];
      for (const i in bodyInfo) {
        let moviesInfo = await getGroupMoviesInfo(bodyInfo[i]._id);
        let tmp = { id : bodyInfo[i]._id, name : bodyInfo[i]._source.name, description: bodyInfo[i]._source.description };
        bodyInfo[i] = {
          id : tmp.id,
          name : tmp.name,
          description: tmp.description, 
          "number of movies" : moviesInfo.numberOfMovies, 
          "total duration" : moviesInfo.totalDuration};
      }  
      return bodyInfo;
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
  return fetch(baseURL + `groups/_doc/${groupId}?refresh=wait_for`, {
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
  return fetch(baseURL + `groups/_doc/${groupId}?refresh=wait_for`, { method: "DELETE" })
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
      runtime: movieInfo.runtime,
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
          actors: movieInfo.actors
        }
    );
}

// function getMovieById(movieId) {
//   return fetch(baseURL + `movies/_doc/${movieId}`)
//     .then((response) => response.json())
//     .then((body) => body._source);
// }

function deleteMovie(userToken, groupId, movieId) {
  return fetch(baseURL + `movies/_doc/${movieId}?refresh=wait_for`, { method: "DELETE" }).then(
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
      let bodyInfo = body.hits.hits;
      let movies = bodyInfo.map((hits) => hits._source);
      for (const mov in movies) {
        totalDuration += movies[mov].runtime;
      }
      return {
        movies: movies.map((movie, index) => movie = {
          _id: bodyInfo[index]._id,
          groupId: movie.groupId,
          id: movie.id,
          title: movie.title,
          image: movie.image,
          runtime: movie.runtime
        }),
        numberOfMovies: body.hits.total.value,
        totalDuration: totalDuration,
      };
    });
}

function removeGroupMovies(groupId) {
  return fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"?refresh=wait_for`, {
    method: "POST",
  }).then((response) => response.json());
}
//-----------------------------------------------------------------------------------------------------------------------------------

export default {
  createUser,
  createGroup,
  getGroupById,
  validateUser,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
};
