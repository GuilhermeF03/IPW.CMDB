// API - handles HTTP request and redirects to services module
import * as services from "./cmdb-services.mjs";
import { convertToHttpError } from "../errors/http-errors.mjs";

// Handlers//

// This handlers don't require any user token
export const getPopularMovies = getPopularMoviesInternal();
export const searchMovie = searchMovieInternal();
export const createUser = createUserInternal();

// Each handler requires a user token, token is validated on 'services' module
export const createGroup = verifyAuthentication(createGroupInternal());
export const updateGroup = verifyAuthentication(updateGroupInternal());
export const listGroups = verifyAuthentication(listGroupsInternal());
export const deleteGroup = verifyAuthentication(deleteGroupInternal());
export const deleteMovie = verifyAuthentication(deleteMovieInternal());
export const getMoviesById = verifyAuthentication(getMoviesByIdInternal());
export const putMovies = verifyAuthentication(putMoviesInternal());

//cmdb-server.js -> cmdb-web-api.js -> cmdb-services.js -> cmdb-movies-data.js
//                                                      -> cmdb-data-mem.js

/** POPULAR FORMAT
 * @var {status: `Top {max} movies`, popularMovies : [] }
 */
async function getPopularMoviesInternal(req, resp) {
  // if (Object.values(req.query)[0] != undefined && typeof Object.values(req.query)[0] != Number) 
  //   resp.status(400).json({ error: `Invalid argument given` });
  try {
    let max = Object.values(req.query)[0] || 250;
    const popularMovies = await services.getPopularMovies(max);

    resp.json({
      result: `Top ${req.query.max} movies`,
      movies: popularMovies
    })
    
  } catch (error) {
      const httpError = convertToHttpError(error)
      resp.status(httpError.status).json(httpError.body)
  }
}

/**SEARCH FORMAT
 * @var {status: `Results for <${movieId}>`, results: []}
 */
async function searchMovieInternal(req, resp) {
  try {
    const search = await services.searchMovie(req.params.movieId);
    
    if (search.results.size == 0) 
      resp.status(204).json({ error: `No results for ${req.params.movieId}` });

    resp.json(search);
  } catch {
    const httpError = convertToHttpError(error)
    resp.status(httpError.status).json(httpError.body)
  }
}

/**USER FORMAT
 * @var  {token :{name : "user-name", groups : [object]}} 
 */
async function createUserInternal(req, resp) {
  // if (req.body == undefined) 
  //   resp.status(204).json({ error: "No content" });
  try {
    let newUser = await services.createUser(req.body);

    resp.status(201).json({
      status: `User <${newUser.name}> created with token <${Object.keys(newUser)[0]}>`,
      'user-info': newUser
    });

  } catch (error) {
    const httpError = convertToHttpError(error)
    resp.status(httpError.status).json(httpError.body)
  }
}

/**GROUP FORMAT
 * @var  {id : ,name: "", description : "", movies : [object]}
 */
async function createGroupInternal(req, resp) {
  // if(req.body == undefined) resp.status(204).json({error: "No content"}) 
  try {
    let newGroup = await services.createGroup(req.body)

    resp.status(201).json({
      status: `Group created with id: <${newGroup.id}>, name: <${newGroup.name}> and description: <${newGroup.description}>`,
      'new-group' : newGroup
    })

  } catch (error) {
    const httpError = convertToHttpError(error)
    resp.status(httpError.status).json(httpError.body)
  }
}

/**GROUP FORMAT
 * @var  {name: "", description : "", movies : [object]}
 */
async function updateGroupInternal(req, resp) {
  // if(req.body == undefined) resp.status(204).json({error: "No content"}) 
  try {
    let updatedGroup = await services.updateGroup(req.params.groupId, req.body)

    resp.status(200).json({
      status: `Group <${updatedGroup.name}>, with id <${req.params.groupId}> updated successfully`,
      'updated-group': updatedGroup
    })  

  } catch(error) {
    const httpError = convertToHttpError(error)
    resp.status(httpError.status).json(httpError.body)
  }
}

/**ALL USER GROUPS
 * @var {user : name, groups: []}
 */
async function listGroupsInternal(req, resp) {
  try {
    let userGroups = await services.listUserGroups()
    resp.status().json({
      status: `Retured all ${userGroups.groups.size} ${userGroups.name}'s groups`,
      'users-groups': userGroups.groups
    })
    
  } catch (error) {
    const httpError = convertToHttpError(error)
    resp.status(httpError.status).json(httpError.body)
  }
}


/**
 * @var
 * 
 * splice(id,1)
 */
async function deleteGroupInternal(req, resp) {

}

async function deleteMovieInternal(req, resp) {

}

async function getMoviesByIdInternal(req, resp) {

}

async function putMoviesInternal(req, resp) {
  
}



// VERIFIERS
function verifyAuthentication(handlerFunction) {
  return function (req, resp) {
    let userToken = req.get("Authorization");
    userToken = userToken ? userToken.split(" ")[1] : null;

    if (!userToken)
      return resp.status(400).json({ error: `User token not provided` });

    req.userToken = userToken; 
    handlerFunction(req, resp);
  };
}

/** DATA
* @var {
*  token1 : {user-info},
*  token2 : {user-info}
* }
*/

/** USER-INFO
 * @var {
 *  name,
 *  groups : {id1 : {group}}
 * }
 */

 /** GROUP-INFO
  * @var {
  *   name,
  *   description,
  *   movies : [movie-info]
  * }
  * 
  * 
  * @return {id : array.size - 1,name,description,movie} -> anonymous response
  */

 /** MOVIE-INFO
  * @var {
  *   title,
  *   description,
  *   run-time
  * }
  */

// {
//   "3fa85f64-5717-4562-b3fc-2c963f66afa6": 
//   {
//     name:antonio,

//     groups: []
//   }
// },......20,
// , "31787409894190'19551809480918419840'9":
//   {
//   name:antonio,

//   groups: [
//     { name, dexription, movies[]}
//     {name, description, movies}
//   ]
//   }},














