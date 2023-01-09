import { errors } from "../../errors/http-errors.mjs";
import crypto from "node:crypto";

const MAX_LIMIT = 250;
const range = (max) => Array.from(Array(max + 1).keys()).slice(1, max + 1);

export default function (data, mem) {
  /* ----------------- [AUX] ------------------------------------------------------------------------------------------------------------------- */
  if (!data) throw new Error("[Ser] Data module not provided");
  if (!mem) throw new Error("[Ser] Mem module not provided");

  // async function validateId(id) {
  //   if (isNaN(id) || id < 0)
  //     return Promise.reject(
  //       errors.BAD_REQUEST(`[Ser] Invalid group id <${id}>.`)
  //     );
  // }

  async function validateMaxMovies(max) {
    if (isNaN(max) || !range(MAX_LIMIT).includes(max))
      return Promise.reject(
        errors.BAD_REQUEST(
          `[Ser] Invalid max limit <${max}> -> must be a integer in [1..250]`
        )
      );
  }

  async function validateString(value) {
    if (!(typeof value == "string" && value != ""))
      return Promise.reject(errors.BAD_REQUEST());
  }

  /* ---------------------- [GENERAL] ------------------------------------------------------------------------------------------------------- */
  async function getPopularMovies(max) {
    max = Number(max);
    await validateMaxMovies(max);

    let topMovies = await data.getTop250();
    topMovies.results.splice(max, MAX_LIMIT - max);

    if (topMovies.results.length == 0)
      return Promise.reject(errors.NOT_FOUND());

    return topMovies;
  }

  async function searchMovie(movieName, max) {
    max = Number(max);
    await validateMaxMovies(max);

    const movies = await data.searchMovieByName(movieName);
    movies.results.splice(max, MAX_LIMIT - max);

    return movies;
  }

  async function getMovieById(movieId) {
    return await data.getMovieById(movieId);
  }

  async function createUser(userInfo) {
    
    await validateString(userInfo.name);

    let uInfo = { token: crypto.randomUUID(), name: userInfo.name };
    
    //console.log(uInfo.token);
    await mem.createUser(uInfo);

    return uInfo;
  }

  /* ---------------------- [GROUPS] -------------------------------------------------------------------------------------------------------- */
  async function createGroup(userToken, groupInfo) {
    await mem.createGroup(userToken, groupInfo);
  }

  async function listUserGroups(userToken) {
    return await mem.listUserGroups(userToken);
  }

  async function getGroupById(userToken, groupId) {
    return await mem.getGroupById(userToken, groupId);
  }

  async function updateGroup(userToken, groupId, updateInfo) {
    // Validate Info
    await validateString(updateInfo.name);
    await validateString(updateInfo.description);

    await mem.updateGroup(userToken, groupId, updateInfo);
    // talvez
  }

  async function deleteGroup(userToken, groupId) {
    await mem.deleteGroup(userToken, groupId);
  }

  /* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */

  async function addMovie(userToken, groupId, movieId) {
    let mInfo = await data.getMovieById(movieId);

    await mem.addMovie(userToken, groupId, mInfo);
  }

  async function deleteMovie(userToken, groupId, movieId) {
    await mem.deleteMovie(userToken, groupId, movieId);
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
