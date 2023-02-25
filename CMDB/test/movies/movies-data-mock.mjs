const top250Path = "./test/movies/top250.json";
// const searchGodfatherByPath = `CMDB/test/movies/searchMovieTheGodfatherPart2.json`;
// const getDarkKnightByPath = `CMDB/test/movies/getMovieByIdDarkKnight.json`;
// const getLordOfTheRingsByPath = `CMDB/test/movies/getMovieByIdLordOfTheRings.json`;
// const getPulpFictionByPath = `CMDB/test/movies/getMovieByIdPulpFiction.json`;

import fs from "node:fs/promises"
import { errors } from "../../errors/http-errors.mjs";

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
          image: mov.image
        })
    ),
  };
}


async function searchMovieByName(path) {
  let search = await mockFetch(path);
  return {
    results: search.results.map(
      (elem) =>
        (elem = {
          id: elem.id,
          title: elem.title,
          description: elem.description,
          image: elem.image
        })
    ),
  };
}

async function getMovieById(path) {
  let movie = await mockFetch(path);

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
    image: movie.image,
    directors: movie.directors,
    actors: movie.stars
  };
}

export default {
  searchMovieByName,
  getTop250,
  getMovieById,
};

async function mockFetch(path) {
  let data = await fs.readFile(path)
  return JSON.parse(data)
}
