// API - handles HTTP request and redirects to services module
import * as services from "./cmdb-services.mjs";

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
async function getPopularMoviesInternal(req, resp) {
  if (Object.values(req.query)[0] != undefined && typeof Object.values(req.query)[0] != Number) 
    resp.status(400).json({ error: `Invalid argument given` });

  try {
    let max = Object.values(req.query)[0] || 250
    const popularMovies = await services.getPopularMovies(max);

    resp.json({
      result: `Top ${req.query.max} movies`,
      movies: popularMovies
    })

  } catch {
    //verify error
  }
}

async function searchMovieInternal(req, resp) {
  try {
    const search = await services.searchMovie(req.params.movieId);

    if (search.results.size == 0) 
      resp.status(204).json({ error: `No results for ${req.params.movieId}` });
    resp.json(search);
  } catch {
    //verify erro
  }
}

async function createUserInternal(req, resp) {
  if (req.body == undefined) 
    resp.status(204).json({ error: "No content" });

  try {
    let newUser = await services.createUser(req.body);
    resp.status(201).json({
      status: `User created with token ${newUser.id}`,
      id: newUser
    });
  } catch (error) {
    
  }
}

async function createGroupInternal(req, resp) {
  if(req.body == undefined) resp.status(204).json({error: "No content"}) 
  try {
    let newGroup = await services.createGroup(req.body)
    resp.status(201).json({
      status: `Group created with id: <${newGroup.id}>, name: <${newGroup.name}> and description: <${newGroup.description}>`,
      group : newGroup
    })
  } catch (error) {
    // resp.status(400).json({error: `Error creating group: ${error}`})
  }
}
// async function searchMovieInternal(req, resp) {
//   try {
//     const search = await services.searchMovie(req.params.movieId);

//     if (search.results.size == 0)
//       resp.status(204).json({ error: `No results for ${req.params.movieId}` });

//     resp.json(search);
//   } catch {
//     //verify erro
//   }
// }

async function updateGroupInternal(req, resp) {
  if(req.body == undefined) resp.status(204).json({error: "No content"}) 
  try {
    let uptGroup = await services.createGroup(req.params.id)
    resp.stat
    
    
  }
}

async function listGroupsInternal(req, resp) {
  try {
    
  } catch (error) {
    
  }
}

async function deleteGroupInternal(req, resp) {}

async function deleteMovieInternal(req, resp) {}

async function getMoviesByIdInternal(req, resp) {}

async function putMoviesInternal(req,resp){}


// High order function that takes user token from request -> redirect to respective handler
function verifyAuthentication(handlerFunction) {
  return function (req, resp) {
    let userToken = req.get("Authorization");
    userToken = userToken ? userToken.split(" ")[1] : null;

    if (!userToken)
      return resp.status(401).json({ error: `User token not provided` });

    req.userToken = userToken;
    handlerFunction(req, resp);
  };
}
