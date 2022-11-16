import data from "./cmdb-movies-data.mjs";
import mem from "./cmdb-data-mem.mjs";
import fetch from "node-fetch";
import { convertToHttpError } from "../errors/http-errors.mjs";

const MAX_LIMIT = 250

async function getPopularMovies(max) {
  max = Number(max)

  if(isNAN(limit) || max <= 0 || max > MAX_LIMIT) {
    throw (`Limit must be positive, less than ${max}`)
  }
  
  try {
    const topMovies = await data.getTop250()
    topMovies.items.splice(max, MAX_LIMIT - max)
    return {results : topMovies.items.map((elem) => (elem = {id: elem.id, rank: elem.rank, title: elem.title, imDbRating: elem.imDbRating}))}
  } catch (error) {
    // const httpErr = convertToHttpError(error)
    // return httpErr
  }
  
  
}

async function searchMovie(movieName, max) {
  try {
    const data = await searchMovieByName(movieName)
    data.results.splice(max, MAX_LIMIT - max);
    return {results: data.results.map((elem) => (elem = {id: elem.id, title: elem.title, year : elem.year, description: elem.description}))};
  } catch (error) {
    
  }
}

async function createUser(userInfo) {
  try{
    let uInfo = {token : crypto.randomUUID(), name : userInfo.name}
    await mem.createUser(uInfo)
    return uInfo
  }catch(error){
    
  }
}

async function createGroup(userToken, groupInfo) {
  try {
    await validateUser(userToken)
    let gInfo = await mem.createGroup(userToken, groupInfo)
    return {id: gInfo.id, name: gInfo.name, description: gInfo.description}
  } catch (error) {
    
  }
}

async function getGroupById(userToken, groupId) {
  try {
    await validateUser(userToken)
    let gInfo = await mem.getGroupById(userToken, groupId)
    return {id: gInfo.id, name: gInfo.name, description: gInfo.description}
  } catch (error) {
    
  }
}

async function updateGroup(userToken, groupId, updateInfo) {
  try {
    await validateUser(userToken)
    let gInfo = await mem.updateGroup(userToken, groupId, updateInfo)
    return {name : gInfo.name, description : gInfo.description}
  } catch (error) {
    
  }
}

async function deleteGroup(userToken, groupId) {
  try {
    await validateUser(userToken)
    let gInfo = {name : await mem.getGroupById(userToken,groupId).name}
    await(mem.deleteGroup(userToken,groupId))
    return gInfo
  } catch (error) {
    
  }
}

async function listUserGroups(userToken) {
  try {
    await validateUser(userToken)
    return await mem.listUserGroups(userToken)
    
  } catch (error) {
    
  }
}

async function deleteMovie(userToken, groupId, movieId) {
  try {
    await validateUser(userToken)
    
  } catch (error) {
    
  }
}

async function addMovie(userToken, groupId, movieId) {
  try { 
    await validateUser(userToken)
    

  } catch (error) {
    
  }
}


async function validateUser(token) {
  return await mem.validateUser(token)
}





export const services = {
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

export default services;
