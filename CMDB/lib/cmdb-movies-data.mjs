const apiKey = "k_iw34bd1e";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;
import fetch from "node-fetch";


async function getTop250() {
  try {
    let top = await (await fetch(top250Url)).json();

    return {
      results: top.items.map(
        mov =>
          (mov = {
            rank: mov.rank,
            id: mov.id,
            title: mov.title,
            year: mov.year,
            imDbRating: mov.imDbRating,
          })
      ),
    };
  } catch (error) {console.error(error)}
}

// TODO: add error
async function searchMovieByName(movieName) {
  try {
    let search = await await fetch(
      `${searchMovieByNameUrl}${movieName}`
    ).json();
    return {
      expression: movieName,
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

async function getMovieById(movieId) {
  try {
    let movie = await (await fetch(`${getMovieByIdUrl}${movieId}`)).json();

    return {
      id: movie.id,
      title: movie.title,
      description : movie.plot,
      runtime: movie.runtimeMins,
      year: movie.year,
    };
  } catch (error) {}
}

export default {
  searchMovieByName,
  getTop250,
  getMovieById,
};