import { errors } from "../../errors/http-errors.mjs";
import crypto from "node:crypto"


const MAX_LIMIT = 250;
const range = (max) => Array.from(Array(max + 1).keys()).slice(1, max + 1);

export default function(data, mem) {

// [AUXILLIARY VALIDATORS]
  async function validateId(id) {
    if (isNaN(id) || id < 0)
      return Promise.reject(errors.BAD_REQUEST(`[Ser] Invalid group id <${id}>.`))
  }

  async function validateMaxMovies(max) {
    if (isNaN(max) || !range(MAX_LIMIT).includes(max))
      return Promise.reject(errors.BAD_REQUEST(`[Ser] Invalid max limit <${max}> -> must be a integer in [1..250]`))
  }

  async function isValidString(value) {
    if (!(typeof value == "string" && value != ""))
      return Promise.reject(errors.BAD_REQUEST())
  }

  if (!data) throw new Error ("[Ser] Data module not provided");
  if (!mem) throw new Error ("[Ser] Mem module not provided");


  /* ---------------------- [GENERAL] ------------------------------------------------------------------------------------------------------- */
  async function getPopularMovies(max) {
    max = Number(max);
    await validateMaxMovies(max);

    let topMovies = await data.getTop250();
    topMovies.results.splice(max, MAX_LIMIT - max);
  
    if (topMovies.results.length == 0) 
      return Promise.reject(errors.NOT_FOUND())
    
    return topMovies;
  }

  async function searchMovie(movieName, max) {
    max = Number(max);
    await validateMaxMovies(max);

    const movies = await data.searchMovieByName(movieName);
    movies.results.splice(max, MAX_LIMIT - max);

    return movies;
  }

  async function createUser(userInfo) {
    await isValidString(userInfo.name);

    let uInfo = { token: crypto.randomUUID(), name: userInfo.name };

    await mem.createUser(uInfo);

    return uInfo;
  }


  /* ---------------------- [GROUPS] -------------------------------------------------------------------------------------------------------- */
  async function createGroup(userToken, groupInfo) {
    return await mem.createGroup(userToken, groupInfo);
  }

  async function listUserGroups(userToken){ return await mem.listUserGroups(userToken); }

  

  async function getGroupById(userToken, groupId) {
    groupId = Number(groupId);

    await validateId(groupId);

    return await mem.getGroupById(userToken, groupId); 

  }

  async function updateGroup(userToken, groupId, updateInfo) {
    groupId = Number(groupId);

    // Validate Info
    await isValidString(updateInfo.name);
    await isValidString(updateInfo.description);
    await validateId(groupId);

    return await mem.updateGroup(userToken, groupId, updateInfo); ;
  }

  async function deleteGroup(userToken, groupId) {
    groupId = Number(groupId);
    await validateId(groupId);

    await mem.deleteGroup(userToken, groupId);

    return { name: (await mem.getGroupById(userToken, groupId)).name }; 
  }
 

  /* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
  async function getMovieById(movieId) {return await data.getMovieById(movieId);}
  
  
  
  
  async function addMovie(userToken, groupId, movieId) {

    groupId = Number(groupId);

    await validateId(groupId);
    let mInfo = await data.getMovieById(movieId);

    return await mem.addMovie(userToken, groupId, mInfo); 
  }

  async function deleteMovie(userToken, groupId, movieId) {
    groupId = Number(groupId);

    await validateId(groupId);

    let info = {
      title : await (await data.getMovieById(movieId)).title,
      group : (await mem.getGroupById(userToken, groupId))
    }  

    await mem.deleteMovie(userToken, groupId, movieId);
    
    return info;
  }


  return {
    getPopularMovies,
    searchMovie,
    getMovieById,
    createUser,
    createGroup,
    updateGroup,
    listUserGroups,
    deleteGroup,
    deleteMovie,
    addMovie,
    getGroupById,
  };
}