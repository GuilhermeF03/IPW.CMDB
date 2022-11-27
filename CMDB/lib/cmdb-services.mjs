import { errors } from "../errors/http-errors.mjs";
import crypto from "node:crypto"


const MAX_LIMIT = 250;
const range = (max) => Array.from(Array(max + 1).keys()).slice(1, max + 1);

export default function(data, mem) {

// [AUXILLIARY VALIDATORS]
  async function validateId(id) {
    if (isNaN(id) || id < 0)
      return Promise.reject(errors.BAD_REQUEST(`Invalid group id <${id}>.`))
  }

  async function validateMaxMovies(max) {
    if (isNaN(max) || !range(MAX_LIMIT).includes(max))
      return Promise.reject(errors.BAD_REQUEST(`Invalid max limit <${max}> -> must be a integer in [1..250]`))
  }

  async function isValidString(value) {
    if (!(typeof value == "string" && value != ""))
      return Promise.reject(errors.BAD_REQUEST())
  }

  if (!data) throw new Error ("[s] Data module not provided");
  if (!mem) throw new Error ("[s] Mem module not provided");


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

  async function listUserGroups(userToken) {
    let groups = await mem.listUserGroups(userToken);

    if (!groups)
      throw new Error("No groups found");
    
    return groups;
  }

  async function getGroupById(userToken, groupId) {
    groupId = Number(groupId);

    await validateId(groupId);

    let gInfo = await mem.getGroupById(userToken, groupId); 
    
    if (!gInfo)
      return Promise.reject(errors.NOT_FOUND("The group you were trying to find does not exist."))
    
    return gInfo;
  }

  async function updateGroup(userToken, groupId, updateInfo) {
    groupId = Number(groupId);

    // Validate Info
    await isValidString(updateInfo.name);
    await isValidString(updateInfo.description);
    await validateId(groupId);
    
    let gInfo = await mem.updateGroup(userToken, groupId, updateInfo); 
    
    if (!gInfo) return Promise.reject(errors.NOT_FOUND())

    return gInfo;
  }

  async function deleteGroup(userToken, groupId) {
    groupId = Number(groupId);
    await validateId(groupId);

    let gInfo = { name: (await mem.getGroupById(userToken, groupId)).name }; 

    if (!gInfo)
      throw new Error("Group not found");

    await mem.deleteGroup(userToken, groupId);

    return gInfo;
  }
 

  /* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
  async function addMovie(userToken, groupId, movieId) {

    groupId = Number(groupId);

    await validateId(groupId);
    let mInfo = await data.getMovieById(movieId);

    if (!mInfo)
      return Promise.reject(errors.NOT_FOUND(`Movie with id <${movieId}> was not found.`));
    
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
