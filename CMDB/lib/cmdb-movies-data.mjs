const apiKey = "k_iw34bd1e";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;
import fetch, { FetchError } from "node-fetch";
// import { errors } from "../errors/http-errors.mjs";


async function getTop250() {
  try {
    let top = await parseFetch(top250Url);

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
  } catch (error) {
    console.log(error)
  }
}

// TODO: add error
async function searchMovieByName(movieName) {
  try {
    let search = await parseFetch(`${searchMovieByNameUrl}${movieName}`)
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

async function getMovieById(movieId) {
  try {
    let movie = await parseFetch(`${getMovieByIdUrl}${movieId}`);

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

async function parseFetch(url){
  try{
    const response = await fetch(url)

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;
  
    if (!response.ok) {
      // get error message from body or default to response status
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
  }
  return data

  }catch(error){
    if(error.code == 'ENOTFOUND')
      console.error("[IMDB] 502: BAD GATEWAY - check your network.")
    console.error()
  } 
}