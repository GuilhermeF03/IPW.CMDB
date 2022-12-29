import { response } from "express";
import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

// TODO: CHECKED
function createUser(userInfo) {
  return fetch(baseURL + `users/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then((response) => response.json());
  // TODO: fazer as retorno
}

// TODO: CHECKED
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
  // TODO: fazer as retorno
}

// TODO: iterate over all groups
// TODO: rever o formato
function listUserGroups(userToken) {
  return fetch(baseURL + `groups/_search?q=userToken:"${userToken}"`, {
    headers: { "Accept": "application/json" },
  })
    .then(response => response.json())
    .then(body => body.hits.hits.map(t => t._source))
    // .then(groups => console.log(groups)); undifeined
  // TODO: retorno
}

// TODO: CHECKED
function getGroupById(groupId) {
  return fetch(baseURL + `groups/_doc/${groupId}`)
    // TODO: VERIFY
    .then(response => response.json())
    .then(body => body._source);
}

// TODO: CHECKED
// TODO: check refresh
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
    // .then(TODO:delete movies)
}

// TODO: CHECKED
function addMovie(groupId, movieInfo) {
  return fetch(baseURL + `movies/_doc?refresh=wait_for`, {
    method: "POST",
    body: JSON.stringify({
      groupId: groupId,
      id: movieInfo.id,
      title: movieInfo.title,
      description: movieInfo.plot,
      runtime: movieInfo.runtimeMins,
      year: movieInfo.year,
    }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  }).then(response => response.json())
 }

 // TODO: CHECKED
function getMovieById(movieId){
  return fetch(baseURL + `movies/_doc/${movieId}`)
  .then(response => response.json())
  .then(body => body._source);
}

 // TODO: CHECKED
function deleteMovie(movieId) {
  return fetch(baseURL + `movies/_doc/${movieId}`, {method: "DELETE"})
    .then(response => response.json())
 }

  // TODO: CHECKED
function deleteMovies(groupId) {
  return fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"`, {
    method: "POST"})
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
