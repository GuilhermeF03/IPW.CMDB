//const apiKey = "k_iw34bd1e"; 
//const apiKey = "k_agj13wln";
const apiKey = "k_nibrgm60";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;

import fetch, { FetchError } from "node-fetch";
import { errors } from "../../errors/http-errors.mjs";

async function getTop250()
{
    let top = await parseFetch(top250Url);
    return (
    {    
    results: top.items.map((mov) =>(mov = 
    {
        rank: mov.rank,
        id: mov.id,
        title: mov.title,
        year: mov.year,
        imDbRating: mov.imDbRating,
        image: mov.image
    })),
  });
}

async function searchMovieByName(movieName)
{
    let search = await parseFetch(`${searchMovieByNameUrl}${movieName}`);
    return (
    {
        results: search.results.map((elem) => (elem = 
        {
            id: elem.id,
            title: elem.title,
            description: elem.description,
            image: elem.image
        })),
    });
}

async function getMovieById(movieId) 
{
    let movie = await parseFetch(`${getMovieByIdUrl}${movieId}`);
    if (!movie.title)
        return Promise.reject(errors.NOT_FOUND());
    return (
    {
        id: movie.id,
        title: movie.title,
        description: movie.plot,
        runtime: parseInt(movie.runtimeMins),
        year: movie.year,
        image: movie.image,
        directors: movie.directors,
        actors: movie.stars
    });
}

async function parseFetch(url) 
{
  try {
    const response = await fetch(url);
    const isJson = 
    response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;
    if (!response.ok) 
    {
      const error = (data && data.message) || response.status;
      return Promise.reject(error);
    }
    return data;
  } catch (error) 
  {
    if (error.code == "ENOTFOUND")
      console.error("[E] 502: BAD GATEWAY - check your network.");
    console.error();
  }
}

export default {
    searchMovieByName,
    getTop250,
    getMovieById,
};
