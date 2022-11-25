const apiKey = "k_iw34bd1e";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;

async function searchMovieByName(movieName) {
  let search = await (await fetch(`${searchMovieByNameUrl}${movieName}`).json());
  return {
    results: search.results.map(
      (elem) =>
        (elem = {
          id: elem.id,
          title: elem.title,
          year: elem.year,
          description: elem.description,
        })
    ),
  };
}

async function getTop250() {
  let top = await (await fetch(top250Url)).json();
  return {
    results: top.items.map(
      mov =>
        (mov = {
          id: elem.id,
          rank: elem.rank,
          title: elem.title,
          year: elem.title,
          imDbRating: elem.imDbRating,
        })
    ),
  };
}

async function getMovieById(movieId) {
  let movie = await (await fetch(`${getMovieByIdUrl}${movieId}`)).json();

  return {
    id: movie.id,
    title: movie.title,
    duration: movie.runtimeMins,
    year: movie.year,
  };
}

export const data = {
  searchMovieByName,
  getTop250,
  getMovieById,
};
export default data;
