// API - handles HTTP request and redirects to services module
import services from "./cmdb-services.mjs";

// Handlers//

// This handlers don't require any user token
export const getPopularMovies = getPopularMovies();
export const searchMovie = searchMovie();
export const createUser = createUser();

// Each handler requires a user token, token is validated on 'services' module
export const createGroup = verifyAuthentication(createGroup());
export const updateMovies = verifyAuthentication(updateMovies());
export const listGroups = verifyAuthentication(listGroups());
export const deleteGroup = verifyAuthentication(deleteGroup());
export const deleteMovie = verifyAuthentication(deleteMovie());
export const getMoviesById = verifyAuthentication(getMoviesById());
export const putMovies = verifyAuthentication(putMovies());

//cmdb-server.js -> cmdb-web-api.js -> cmdb-services.js -> cmdb-movies-data.js
//                                                      -> cmdb-data-mem.js
async function getPopularMovies(req, resp) {
  if (req.query.max = undefined)
    resp.status(400).json({ error: "Invalid query" });


  try {
    const popularMovies = await services.getPopularMovies(req.query);
    resp.write(`Top ${req.query.max} movies`).json(popularMovies);
  } catch {
    (error) => resp.status(404).json(error);
  }
}

async function searchMovie(req, resp) {
  if (req.params.movieId == undefined)
    resp.status(400).json({ error: "Undefined Id of the movie" });
  try {
    const search = await services.searchMovie(req.params.movieId);
    resp.json(search);
    if (search.results.size == 0)
      resp.status(204).json({ error: `No results for ${req.params.movieId}` });
  } catch {
    (error) => resp.status(404).json(error);
  }
}

async function createUser(req, resp) {
  if (req.body == 0) resp.status(204).json({ error: "No content" });
  try {
    let newUser = await services.createUser(req.body);
    resp.status(201).json({
      status: `User created with id ${newUser.id}`,
      id: newUser.id,
    });
  } catch (error) {
    resp.status(400).json({ error: `Error creating user: ${error}` });
  }
}

async function createGroup(req, resp) {}

async function updateMovies(req, resp) {}

async function listGroups(req, resp) {}

async function deleteGroup(req, resp) {}

async function deleteMovie(req, resp) {}

async function getMoviesById(req, resp) {}

async function putMovies(req, resp) {}

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
