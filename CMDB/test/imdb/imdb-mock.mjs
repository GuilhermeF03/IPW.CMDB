//const apiKey = "k_iw34bd1e"; 
//const apiKey = "k_agj13wln";
import { errors } from "../../errors/http-errors.mjs";
import fs from "node:fs/promises";
import path from "path";
import url from "url";
import { read } from "node:fs";

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const __250Path = path.join(__dirname,'.\\','movies','top250.json');
const __searchPath = (movieName) => path.join(__dirname, '.\\','movies','mock-search',`search-${movieName}.json` );
const __idPath = (id_name) => path.join(__dirname,'.\\','movies',`getMovieById${id_name}.json`);

const idsMap = {0:'DarkKnight', 1:'LordOfTheRings', 2:'PulpFiction'}


const getTop250Mock = () => 
    fs.readFile(__250Path)
    .then(data => JSON.parse(data))
    .catch()
const searchMovieByNameMock = (movieName) => 
    fs.readFile(__searchPath(movieName))
    .then(data => JSON.parse(data))
    .catch()
const getMovieByIdMock = (movieId) =>
    fs.readFile(__idPath(idsMap[movieId]))
    .then(data => JSON.parse(data))
    .catch()

async function getTop250()
{
  let top = await getTop250Mock();
  return (
  {
    results: top.items.map(mov => mov = 
    {
        rank: mov.rank,
        id: mov.id,
        title: mov.title,
        year: mov.year,
        imDbRating: mov.imDbRating,
        image: mov.image
    }),
  });
}

async function searchMovieByName(movieName) 
{
  let search = await searchMovieByNameMock(movieName);
  return (
  {
    results: search.results.map(elem => elem = 
    {
        id: elem.id,
        title: elem.title,
        description: elem.description,
        image: elem.image
    }),
  });
}

async function getMovieById(movieId) 
{
  let movie = await getMovieByIdMock(movieId);
  if (!movie.title)
    return Promise.reject(errors.NOT_FOUND("[Imdb] The movie you're trying to access could not be found."));
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

export default {
  searchMovieByName,
  getTop250,
  getMovieById,
};


