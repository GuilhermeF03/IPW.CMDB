import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

/* ---------------------- [USER] -------------------------------------------------------------------------------------------------------- */
function createUser(userInfo) {
  return fetch(baseURL + `users/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then((response) => response.json());
}

/* ---------------------- [GROUP] -------------------------------------------------------------------------------------------------------- */
function createGroup(userToken, groupInfo) {
  return fetch(baseURL + `groups/_doc?refresh=wait_for`, {
      method: "POST",
      body: JSON.stringify({
      userToken: userToken,
      name: groupInfo.name,
      description: groupInfo.description,
      }),
      headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      },
  }).then((response) => response.json())
      //TODO: CHECK
      .then(result => { return {id: result._id, name: groupInfo.name, description: groupInfo.description } })
}

// TODO
// function listUserGroups(userToken) {
//   return fetch(baseURL + `groups/_search?q=userToken:"${userToken}"`, {
//     headers: { "Accept": "application/json" },
//   })
//     .then(response => response.json())
//     .then(body => 
//       body.hits.hits.map(t => 
//         t = {id: t._id,
//             name: t._source.name,
//             description: t._source.description,
//             "number of movies":----,
//             "total duration": }))
// }

function getGroupById(groupId) {
  return fetch(baseURL + `groups/_doc/${groupId}`)
    // TODO: VERIFY
    .then(response => response.json())
    .then(body => body = {name: body.name, description: body.description});
}

function updateGroup(groupId, updateInfo) {
  return fetch(baseURL + `groups/_doc/${groupId}`, {
    method: "PUT",
    body: JSON.stringify(updateInfo),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(response => response.json())
}

// TODO: CHECKED
function deleteGroup(groupId) { 
  return fetch(baseURL + `groups/_doc/${groupId}`, { method: "DELETE" })
    .then(response => response.json())
    .then(removeGroupMovies(groupId))
}

function removeGroupMovies(groupId) {
  return fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"`, {
    method: "POST"})
    .then(response => response.json())
}

/* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
// TODO: rever
function addMovie(groupId, movieInfo) {
  return fetch(baseURL + `movies/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify({
      groupId: groupId,
      id: movieInfo.id,
      title: movieInfo.title,
      description: movieInfo.description,
      runtime: movieInfo.runtimeMins,
      year: movieInfo.year,
      image :movieInfo.image,
      directors : movieInfo.directors,
      actors : movieInfo.actors
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(response => response.json())
      .then(body => body = { id: body._id, status: body.result});
}

function getMovieById(movieId){
  return fetch(baseURL + `movies/_doc/${movieId}`)
  .then(response => response.json())
  .then(body => body._source);
}

function deleteMovie(movieId) {
  return fetch(baseURL + `movies/_doc/${movieId}`, {method: "DELETE"})
    .then(response => response.json())
 }

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
