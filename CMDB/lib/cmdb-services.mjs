import data from "./cmdb-movies-data.mjs";
import mem from "./cmdb-data-mem.mjs";
import fetch from "node-fetch";
import { convertToHttpError, errors } from "../errors/http-errors.mjs";

//código antigo
/* 
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

*/

const MAX_LIMIT = 250

async function getPopularMovies(max) {
  max = Number(max)

  if(isNAN(max) || max <= 0 || max > MAX_LIMIT) {
    throw `Limit must be positive, less than ${max}`
  }
  
  try {
    const topMovies = await data.getTop250()
    topMovies.items.splice(max, MAX_LIMIT - max)
    return {results : topMovies.items.map((elem) => (elem = { 
      id: elem.id,
      rank: elem.rank, 
      title: elem.title, 
      imDbRating: elem.imDbRating
    }))}
  } catch {
    throw errors.NOT_AUTHORIZED()
  }
}

async function searchMovie(movieName, max) {
  max = Number(max)

  if(isNAN(max) || max <= 0 || max > MAX_LIMIT) {
    throw `Limit must be positive, less than ${max}`
  }

  if(!isValidString(movieName)) {
    throw `Invalid string <${movieName}>`
  }

  try {
    const search = await data.searchMovieByName(movieName)
    search.results.splice(max, MAX_LIMIT - max);
    return {results: search.results.map((elem) => ({id: elem.id, title: elem.title, year : elem.year, description: elem.description}))};
  } catch {
    throw `movie <${movieName}> not found`
  }
}

async function createUser(userInfo) {
  if(userInfo.name == undefined) {
    throw `Invalid user name`
  }
  let uInfo = {token : crypto.randomUUID(), name : userInfo.name}
  await mem.createUser(uInfo)
  
  if(!uInfo.token) {
    throw `token not found`
  }

  if(!uInfo.name) {
    throw `name not found`
  }
  
  return uInfo
  
}

async function createGroup(userToken, groupInfo) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }

  await validateUser(userToken)

  if(!validateUser) {
    throw `Invalid user token`
  }

  let gInfo = await mem.createGroup(userToken, groupInfo)
  if(!gInfo.id) {
    throw `Group Id <${gInfo.id}> not found`
  }
  if(!gInfo.name) {
    throw `Group name <${gInfo.name}> not found`
  }
  if(!gInfo.description) {
    throw `Group description <${gInfo.description}> not found`
  }
  return {id: gInfo.id, name: gInfo.name, description: gInfo.description}
}

async function getGroupById(userToken, groupId) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }

  try {
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    let gInfo = await mem.getGroupById(userToken, groupId)
    // if(gInfo.movies == null) {
    //   throw `The group has no movies`
    // }
    //DÚVIDA NA GINFO.MOVIES.MAP
    return {name: gInfo.name, description: gInfo.description, movies : gInfo.movies.map((elem) => (elem = {
      name: elem.name,
      duration: elem.duration
    }))}
  } catch {
    throw `Group Id not found`
  }
}

async function updateGroup(userToken, groupId, updateInfo) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }
  try {
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    let gInfo = await mem.updateGroup(userToken, groupId, updateInfo)
    return {name : gInfo.name, description : gInfo.description}
  } catch {
    throw `Group Id not found`
  }
}

async function deleteGroup(userToken, groupId) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }
  try {
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    let gInfo = {name : await mem.getGroupById(userToken,groupId).name}
    await(mem.deleteGroup(userToken,groupId))
    return gInfo
  } catch {
    throw `Group Id not found`
  }
}
//DÚVIDA NO LIST USER GROUPS
async function listUserGroups(userToken) {
  try {
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    const listGroup =  await mem.listUserGroups(userToken)
    return {name : listGroup.name, groups : listGroup.groups.map((element) => (element = {
      name: gInfo.name, 
      description: gInfo.description, 
      movies : gInfo.movies.map((elem) => (elem = {
        name: elem.name,
        duration: elem.duration
      }
    ))}))}
  } catch (error) {
    throw `${error}`
  }
}

async function deleteMovie(userToken, groupId, movieId) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }
  try {
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    const movie = await data.getMovieById(movieId)
    if(!movie) {
      throw `Movie Id is not found`
    }
    const delMovie = await mem.deleteMovie(userToken, groupId, movie)
    return {name : delMovie.name, group : delMovie.group}
  } catch (error) {
    
  }
}

async function addMovie(userToken, groupId, movieId) {
  // if(userToken || groupId == undefined) {
  //   throw `Invalid user token or group Information`
  // }
  try { 
    await validateUser(userToken)
    if(!validateUser) {
      throw `Invalid user token`
    }
    const movie = await data.getMovieById(movieId)
    if(!movie) {
      throw `Movie Id is not found`
    }
    const add = await mem.addMovie(userToken, groupId, movie)

    //{group : "", name : "",id: "", info : {movie-info}}
    return {group : add.group, name : add.name, id : add.id, info : add.info.map((elem) => (elem = {
      name: elem.name,
      duration: elem.duration
    }))}
  } catch (error) {
    
  }
}


async function validateUser(token) {
  return await mem.validateUser(token)
}

// Auxiliary function
function isValidString(value) {
  return typeof value == 'string' && value != ""
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
