import { convertToHttpError } from "../errors/http-errors.mjs";


const MAX_LIMIT = 250;
const range = (max) => Array.from(Array(max + 1).keys()).slice(1, max + 1);

// [Validators]
  // TODO: verficar
  async function validateUser(token){
    await mem.validateUser(token)
  }

  async function validateId(id) {
    if (isNaN(id) || id < 0)
      throw "GroupId must be positive number";
    
  }

  async function validateMaxMovies(max) {
    if (isNaN(max) || !range(MAX_LIMIT).includes(max))
      throw `Limit must be positive number, less than ${MAX_LIMIT}`;
  }

  async function isValidString(value) {
    if (!(typeof value == "string" && value != ""))
      throw `Invalid string <${value}>`;
  }

export default function(data, mem) {

  if (!data) throw new Error("[s] Data module not provided");
  if (!mem) throw new Error("[s] Mem module not provided");

  async function getPopularMovies(max) {
    max = Number(max);
    await validateMaxMovies(max);

    let topMovies = await data.getTop250();

    topMovies.results.splice(max, MAX_LIMIT - max);
  
    if (topMovies.results.length == 0) 
      throw new Error("No movies found");
    
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

    if(mem.getUserInfo(uInfo.token))
      throw new Error("Invalid")

    await mem.createUser(uInfo);

    return uInfo;
  }

  // [Group Services]
  async function createGroup(userToken, groupInfo) {
    await validateUser(userToken);
    return await mem.createGroup(userToken, groupInfo);
  }

  async function getGroupById(userToken, groupId) {
    groupId = Number(groupId);

    await validateId(groupId);
    await validateUser(userToken);

    let gInfo = await mem.getGroupById(userToken, groupId);
    
    if (!gInfo)
      throw new Error("Group not found");
    
    return gInfo;
  }

  async function updateGroup(userToken, groupId, updateInfo) {
    groupId = Number(groupId);

    // Validate Info
    await isValidString(updateInfo.name);
    await isValidString(updateInfo.description);
    await validateId(groupId);
    await validateUser(userToken);
    
    let gInfo = await mem.updateGroup(userToken, groupId, updateInfo);
    
    if (!gInfo) throw new Error("Group not found");

    return gInfo;
  }

  async function deleteGroup(userToken, groupId) {
    groupId = Number(groupId);
    await validateId(groupId);
    await validateUser(userToken);

    let gInfo = { name: (await mem.getGroupById(userToken, groupId)).name };

    if (!gInfo)
      throw new Error("Group not found");

    await mem.deleteGroup(userToken, groupId);

    return gInfo;
  }
 

  // mostra os grupos de um utilizador com name e description com os nomes e respetivas durações dos filmes
  async function listUserGroups(userToken) {
    await validateUser(userToken);

    let groups = await mem.listUserGroups(userToken);

    // TODO: verificar
    if (!groups)
      throw new Error("No groups found");
    
    return groups;
  }

// [Movie Services]
  async function addMovie(userToken, groupId, movieId) {
    groupId = Number(groupId);

    await validateId(groupId);
    await validateUser(userToken);

    let mInfo = await data.getMovieById(movieId);
  
    if (!mInfo)
      throw new Error("Movie not found");
    
    let gInfo = await mem.addMovie(userToken, groupId, mInfo);
    
    if (!gInfo)
      throw new Error("Group not found");

    return gInfo;
  }

  async function deleteMovie(userToken, groupId, movieId) {
    groupId = Number(groupId);

    await validateId(groupId);
    await validateUser(userToken);

    let info = {
      title : await mem.getMovieById(userToken, groupId, movieId).title,
      group : await mem.getGroupById(userToken, groupId)
    }

    if (!info.title)
    throw new Error("Movie not found");

    if (!info.group)
      throw new Error("Group not found");
    
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
