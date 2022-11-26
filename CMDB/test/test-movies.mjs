const apiKey = "k_iw34bd1e";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;

import fs from 'node:fs'
import fetch from "node-fetch";

// TODO: add error
async function searchMovieByName(movieName) {
  try {
    let search = await await fetch(
      `${searchMovieByNameUrl}${movieName}`
    ).json();
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
  } catch (error) {
    console.error(error)
  }
}

async function getTop250() {
  try {
    let top = await fs

    return {
      results: top.items.map(
        mov =>
          (mov = {
            id: mov.id,
            rank: mov.rank,
            title: mov.title,
            year: mov.title,
            imDbRating: mov.imDbRating,
          })
      ),
    };
  } catch (error) {console.error(error)}
}

async function getMovieById(movieId) {
  try {
    let movie = await (await fetch(`${getMovieByIdUrl}${movieId}`)).json();

    return {
      id: movie.id,
      title: movie.title,
      duration: movie.runtimeMins,
      year: movie.year,
    };
  } catch (error) {}
}

export default {
  searchMovieByName,
  getTop250,
  getMovieById,
};