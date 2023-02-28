import json from "body-parser"
import fetch from "node-fetch";
import { errors } from "../../errors/http-errors.mjs";
const baseURL = "http://localhost:9200/";

/* ---------------------- [USER] -------------------------------------------------------------------------------------------------------- */
async function createUser(userInfo)
{
  let isDup = await isDuplicated(userInfo.username)
  if (isDup) 
    return Promise.reject(errors.BAD_REQUEST())
  
    console.log("Not duplicated username");
    console.log(userInfo);
    let data = await(await fetch(baseURL + `users/_doc?refresh=wait_for`,
    {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })).json();
    userInfo.token = data._id
    return userInfo;
}

async function isDuplicated(username) 
{
  let resp = await fetch(baseURL + `users/_search?q=username:${username}`)
  let json = await resp.json()
  return await json.hits.hits.map((hits) => hits._source).length > 0;
}

async function validateUserToken(userToken)
{
  let resp = await(await fetch(baseURL + 'users/_doc/' + userToken)).json()
  return resp.found
}

async function validateUser(username, password) 
{
  let resp = await fetch(baseURL + `users/_search?q=username:${username}`)
  let json = await resp.json()
  if(json.hits.hits.length <= 0)
    return Promise.reject(errors.NOT_AUTHORIZED());
  let user = await json.hits.hits.map((hits) => hits._source)[0]
  return user.password == password ? { token: user.token } 
  : Promise.reject(errors.NOT_AUTHORIZED());
}

/* ---------------------- [GROUP] -------------------------------------------------------------------------------------------------------- */
async function createGroup(userToken, groupInfo) 
{
  // check if user exists
  if(!(await validateUserToken(userToken)))
    return Promise.reject(errors.NOT_AUTHORIZED())
  // add group
  let response = await(await fetch(baseURL + `groups/_doc?refresh=wait_for`,
  {
    method: "POST",
    body: JSON.stringify(
    {
      userId: userToken,
      name: groupInfo.name,
      description: groupInfo.description,
    }),
    headers: 
    {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })).json()
  return(
  {
    id: response._id,
    name: groupInfo.name,
    description: groupInfo.description
  });
}

async function listUserGroups(userToken) 
{
  if(!(await validateUserToken(userToken)))
    return Promise.reject(errors.NOT_AUTHORIZED())
  let response = await(await fetch(baseURL + `groups/_search?q=userId:"${userToken}"`, 
  {
      headers: { Accept: "application/json" },
  })).json()
  // filter properties
  if (response.status == 404) 
    return []
  let bodyInfo = await response.hits.hits; // search results
  for (const i in bodyInfo) 
  {
    let moviesInfo = await getGroupMoviesInfo(bodyInfo[i]._id);
    if(!bodyInfo[i]._source)
      continue;
    let tmp =
    {
      id: bodyInfo[i]._id,
      name: bodyInfo[i]._source.name,
      description: bodyInfo[i]._source.description,
      "number of movies": moviesInfo.numberOfMovies,
      "total duration": moviesInfo.totalDuration,
    }
    bodyInfo[i] = tmp
  }
  return bodyInfo
}

async function getGroupById(userToken, groupId) 
{
  let response = await(await fetch(baseURL + `groups/_search?q=userId=${userToken}`)).json()
  let groups = await response.hits.hits;
  if(groups.length <= 0)
    return Promise.reject(errors.NOT_AUTHORIZED());
  if(!(groups.some((group) => group._id == groupId)))
    return Promise.reject(errors.NOT_FOUND());
  let moviesInfo = await getGroupMoviesInfo(groupId);
  return(
  {
    id: groups[0]._id,
    name: groups[0]._source.name,
    description: groups[0]._source.description,
    "number of movies": moviesInfo.numberOfMovies,
    "total duration": moviesInfo.totalDuration,
    movies: moviesInfo.movies,
  });
}

async function updateGroup(userToken, groupId, updateInfo) 
{
  await getGroupById(userToken, groupId);
  let response = await(await fetch(baseURL + `groups/_doc/${groupId}?refresh=wait_for`, 
  {
    method: "PUT",
    body: JSON.stringify({userId: userToken, name: updateInfo.name, description: updateInfo.description,}),
    headers: {"Content-Type": "application/json",Accept: "application/json",},
  })).json();
  return {status: response.result, name: updateInfo.name, description: updateInfo.description,}
}

async function deleteGroup(userToken, groupId) 
{
  await getGroupById(userToken, groupId)
  let response = await(await fetch(baseURL + `groups/_doc/${groupId}?refresh=wait_for`, 
  {
    method: "DELETE",
  })).json()
  await removeGroupMovies(groupId)
}

/* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
async function addMovie(userToken, groupId, movieInfo) 
{
  await getGroupById(userToken, groupId)
  let movie = await getMovieById(userToken, groupId, movieInfo.id)
  if(movie)
    return Promise.reject(errors.BAD_REQUEST())
  movieInfo.groupId = groupId
  let response = await(await fetch(baseURL + `movies/_doc?refresh=wait_for`, 
  {
    method: "POST",
    body: JSON.stringify(movieInfo),
    headers: {"Content-Type": "application/json",Accept: "application/json",},
  })).json();
  movieInfo.movieId = movieInfo.id
  movieInfo.status = response.result
  movieInfo.id = response._id
  return movieInfo
}

async function getMovieById(userToken, groupId, movieId) 
{
  await getGroupById(userToken,groupId);
  let response = await searchMovieById(movieId);
  if(!response)
    return response;
  if(response.groupId != groupId)
    return Promise.reject(errors.NOT_AUTHORIZED())
  response.movieId = response.id
  delete response.id
  return response
}
// search whole movie index for movie with given id
async function searchMovieById(movieId)
{
  let response = await(await fetch(baseURL + `movies/_search?q=id=${movieId}`)).json();
  if(response.hits.hits.length == 0)
    return undefined;
  return response.hits.hits[0]._source;
}

async function deleteMovie(userToken, groupId, movieId)
{ 
  let movie = await getMovieById(userToken, groupId, movieId)
  if(movie == undefined)  
    return Promise.reject(errors.NOT_FOUND())
  await(await fetch(baseURL + `movies/_doc/${movieId}?refresh=wait_for`, 
  {
    method: "DELETE",
  })).json()
}
/* --------------------- [AUX] ---------------------------------------------------------------------------------------------------- */
// Get all <groupId> movies
async function getGroupMoviesInfo(groupId)
{
  let response = await(await fetch(baseURL + `movies/_search?q=groupId:"${groupId}"`)).json();
  let totalDuration = 0;
  let bodyInfo = response.hits.hits;
  let movies = bodyInfo.map((hits) => hits._source);
  for (const mov in movies)
    totalDuration += movies[mov].runtime;
  return (
  {
    movies: movies.map((movie, index) =>
    movie = 
    {
      _id: bodyInfo[index]._id,
      groupId: movie.groupId,
      id: movie.id,
      title: movie.title,
      image: movie.image,
      runtime: movie.runtime,
    }),
    numberOfMovies: response.hits.total.value,
    totalDuration: totalDuration,
  });
}

async function removeGroupMovies(groupId)
{
  return await(await fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"?refresh=wait_for`,
  {
      method: "POST",
  }
  )).json()
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
  getMovieById,
  searchMovieById
};
