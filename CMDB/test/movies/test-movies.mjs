// const apiKey = "k_iw34bd1e"; acabou
// const apiKey = "k_agj13wln"; acabou
const top250Path = `CMDB/test/movies/top250.json`;
const searchMovieByNamePath = `CMDB/test/movies/search.json/`;
const getMovieByIdPath = `CMDB/test/movies/movies-test.json`;

import { errors } from "../errors/http-errors.mjs";

async function getTop250() {
  let top = await mockFetch(top250Path);
  return {
    results: top.items.map(
      (mov) =>
        (mov = {
          rank: mov.rank,
          id: mov.id,
          title: mov.title,
          year: mov.year,
          imDbRating: mov.imDbRating,
        })
    ),
  };
}

// TODO: add error
async function searchMovieByName(movieName) {
  let search = await mockFetch(`${searchMovieByNameUrl}${movieName}`);
  return {
    results: search.results.map(
      (elem) =>
        (elem = {
          id: elem.id,
          title: elem.title,
          description: elem.description,
        })
    ),
  };
}

async function getMovieById(movieId) {
  let movie = await mockFetch(`${getMovieByIdUrl}${movieId}`);

  if (!movie.title)
    return Promise.reject(
      errors.NOT_FOUND(
        "[imdb] The movie you're trying to access could not be found."
      )
    );

  return {
    id: movie.id,
    title: movie.title,
    description: movie.plot,
    runtime: movie.runtimeMins,
    year: movie.year,
  };
}

export default {
  searchMovieByName,
  getTop250,
  getMovieById,
};

async function mockFetch(path) {
  try {
    const response = await fetch(url);

    const isJson = response.headers
      .get("content-type")
      ?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    if (error.code == "ENOTFOUND")
      console.error("[imdb] 502: BAD GATEWAY - check your network.");
    console.error();
  }
}
