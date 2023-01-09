import {expect} from 'chai';

import mem from '../src/mem/cmdb-data-mem.mjs'
//import data from '../src/mem/imdb-movies-data.mjs'
import data from '../test/movies/movies-data-mock.mjs'
import servicesInit from '../src/services/cmdb-services.mjs'

import path from "path";
import url from "url";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.join(__dirname,"..\\","data/data.json");

//let emptyJsonFile = Object.keys(data).forEach(key => delete data[key]);
function emptying() {
  return mem.readData(dataPath).then((data) => {
    Object.getOwnPropertyNames(data).forEach(key => delete data[key]);
    //Object.keys(data).forEach(key => delete data[key]);
    return Promise.resolve(mem.writeData(dataPath, data));
  });
}

await emptying();

const services = servicesInit(data, mem)

const searchGodfatherByPath = "./test/movies/searchMovieTheGodfatherPart2.json";
const getDarkKnightByPath = "./test/movies/getMovieByIdDarkKnight.json";
const getLordOfTheRingsByPath = "./test/movies/getMovieByIdLordOfTheRings.json";
const getPulpFictionByPath = "./test/movies/getMovieByIdPulpFiction.json";

// {
//   "d0ea06ff-4c48-40e7-80df-89ecb05a46bd": {
//       "token": "d0ea06ff-4c48-40e7-80df-89ecb05a46bd",
//       "name": "Ricardo",
//       "groups": []
//   },
//   "e85d1619-82dc-43bf-bba7-b3e9be6edaa3": {
//       "token": "e85d1619-82dc-43bf-bba7-b3e9be6edaa3",
//       "name": "Rodrigo",
//       "groups": []
//   },
//   "20f5410a-49e7-4589-8659-9628e312abd6": {
//       "token": "20f5410a-49e7-4589-8659-9628e312abd6",
//       "name": "Manuel",
//       "groups": []
//   }
// }

const userRicardo = await services.createUser({name: "Ricardo"})
const userRodrigo = await services.createUser({name: "Rodrigo"})
const userManuel = await services.createUser({name: "Manuel"})

describe('Services Tests', () => {

  
  describe('Get top movies tests', () => {
    it('get 3 top movies', () => {
      const getTop3 = services.getPopularMovies(3);
      return getTop3
        .then(getMovies => expect(getMovies)
          .deep.equal({
            "results": [
              {
                "id": "tt0111161",
                "rank": "1",
                "title": "The Shawshank Redemption",
                "image": "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX128_CR0,12,128,176_AL_.jpg",
                "year": "1994",
                "imDbRating": "9.2"
              },
              {
                "id": "tt0068646",
                "rank": "2",
                "title": "The Godfather",
                "image": "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UX128_CR0,12,128,176_AL_.jpg",
                "year": "1972",
                "imDbRating": "9.2"
              },
              {
                "id": "tt0468569",
                "rank": "3",
                "title": "The Dark Knight",
                "image": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_UX128_CR0,12,128,176_AL_.jpg",
                "year": "2008",
                "imDbRating": "9.0"
              }
            ]
          }))
    });
  })
  
  describe('Search all possible movies by a name tests', () => {
    it('get the movie by the title <The Godfather Part II>', () => {
      const search5Movies = services.searchMovie(searchGodfatherByPath, 5)
      return search5Movies
        .then(searchMovie => expect(searchMovie)
          .deep.equal({
            results: [
              {
                id: "tt0071562",
                title: "The Godfather Part II",
                image: "https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.7273_AL_.jpg",
                description: "(1974)"
              },
              {
                id: "tt17566342",
                title: "The Godfather Part II",
                image: "https://imdb-api.com/images/original/nopicture.jpg",
                description: "(2021) (Podcast Episode) - Locked on Marlins - Daily Podcast on the Miami Marlins (2020) (Podcast Series)"
              },
              {
                id: "tt0099674",
                title: "The Godfather Part III",
                image: "https://m.media-amazon.com/images/M/MV5BNWFlYWY2YjYtNjdhNi00MzVlLTg2MTMtMWExNzg4NmM5NmEzXkEyXkFqcGdeQXVyMDk5Mzc5MQ@@._V1_Ratio0.7273_AL_.jpg",
                description: "(1990)"
              },
              {
                id: "tt19829922",
                title: "The Godfather Part III âEUR¢ The Next Reel",
                image: "https://imdb-api.com/images/original/nopicture.jpg",
                description: "(2016) (Podcast Episode) - The Next Reel Film Podcast Master Feed (2011) (Podcast Series)"
              },
              {
                id: "tt19830088",
                title: "The Godfather Part II âEUR¢ The Next Reel",
                image: "https://imdb-api.com/images/original/nopicture.jpg",
                description: "(2016) (Podcast Episode) - The Next Reel Film Podcast Master Feed (2011) (Podcast Series)"
              }
            ]
          }))
    })
  })

  describe('Create groups tests', () => {
    it(`Create group <acao> for user <Ricardo>`, () => {
      return services.createGroup(userRicardo.token, {
        id: "0",
        name: "acao",
        description: "filmes de acao",
        movies : {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 0,
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> for user <Ricardo>`, () => {
      return services.createGroup(userRicardo.token, {
        id: "1",
        name: "fantasia",
        description: "filmes de fantasia",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 1,
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> for user <Ricardo>`, () => {
      return services.createGroup(userRicardo.token, {
        id: "2",
        name: "fim de semana",
        description: "filmes para ver no fim de semana",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 2,
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
    it(`Create group <acao> for user <Rodrigo>`, () => {
      return services.createGroup(userRodrigo.token, {
        id: "0",
        name: "acao",
        description: "filmes de acao",
        movies : {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 0,
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> for user <Rodrigo>`, () => {
      return services.createGroup(userRodrigo.token, {
        id: "1",
        name: "fantasia",
        description: "filmes de fantasia",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 1,
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> for user <Rodrigo>`, () => {
      return services.createGroup(userRodrigo.token, {
        id: "2",
        name: "fim de semana",
        description: "filmes para ver no fim de semana",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 2,
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
    it(`Create group <acao> for user <Manuel>`, () => {
      return services.createGroup(userManuel.token, {
        id: "0",
        name: "acao",
        description: "filmes de acao",
        movies : {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 0,
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> for user <Manuel>`, () => {
      return services.createGroup(userManuel.token, {
        id: "1",
        name: "fantasia",
        description: "filmes de fantasia",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 1,
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> for user <Manuel>`, () => {
      return services.createGroup(userManuel.token, {
        id: "2",
        name: "fim de semana",
        description: "filmes para ver no fim de semana",
        movies: {}
      })
        .then(group => expect(group)
          .deep.equal({
            id: 2,
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
  })

  describe('Adding movies into a group of an user tests', () => {
    it(`Adding movie <The Dark Knight> into the group <acao> for user <Ricardo>`, () => {
      return services.addMovie(userRicardo.token, "0", getDarkKnightByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008",
            image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6762_AL_.jpg",
            directors: "Christopher Nolan",
            actors: "Christian Bale, Heath Ledger, Aaron Eckhart"
          }))
    })
    it(`Adding movie <The Dark Knight> into the group <acao> for user <Rodrigo>`, () => {
      return services.addMovie(userRodrigo.token, "0", getDarkKnightByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008",
            image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6762_AL_.jpg",
            directors: "Christopher Nolan",
            actors: "Christian Bale, Heath Ledger, Aaron Eckhart"
          }))
    })
    it(`Adding movie <The Dark Knight> into the group <acao> for user <Manuel>`, () => {
      return services.addMovie(userManuel.token, "0", getDarkKnightByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008",
            image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6762_AL_.jpg",
            directors: "Christopher Nolan",
            actors: "Christian Bale, Heath Ledger, Aaron Eckhart"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> for user <Ricardo>`, () => {
      return services.addMovie(userRicardo.token, "1", getLordOfTheRingsByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003",
            image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6762_AL_.jpg",
            directors: "Peter Jackson",
            actors: "Elijah Wood, Viggo Mortensen, Ian McKellen"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> for user <Rodrigo>`, () => {
      return services.addMovie(userRodrigo.token, "1", getLordOfTheRingsByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003",
            image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6762_AL_.jpg",
            directors: "Peter Jackson",
            actors: "Elijah Wood, Viggo Mortensen, Ian McKellen"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> for user <Manuel>`, () => {
      return services.addMovie(userManuel.token, "1", getLordOfTheRingsByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003",
            image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6762_AL_.jpg",
            directors: "Peter Jackson",
            actors: "Elijah Wood, Viggo Mortensen, Ian McKellen"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> for user <Ricardo>`, () => {
      return services.addMovie(userRicardo.token, "2", getPulpFictionByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994",
            image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6904_AL_.jpg",
            directors: "Quentin Tarantino",
            actors: "John Travolta, Uma Thurman, Samuel L. Jackson"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> for user <Rodrigo>`, () => {
      return services.addMovie(userRodrigo.token, "2", getPulpFictionByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994",
            image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6904_AL_.jpg",
            directors: "Quentin Tarantino",
            actors: "John Travolta, Uma Thurman, Samuel L. Jackson"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> for user <Manuel>`, () => {
      return services.addMovie(userManuel.token, "2", getPulpFictionByPath)
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994",
            image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6904_AL_.jpg",
            directors: "Quentin Tarantino",
            actors: "John Travolta, Uma Thurman, Samuel L. Jackson"
          }))
    })
  })

  // id:index, 
  // name: elem.name,
  // description: elem.description,
  // "number of movies": Object.keys(elem.movies).length,
  // "total-duration": elem["total-duration"],

  describe('list all groups of users tests', () => {
    it('list all groups of user <Ricardo>', () => {
      return services.listUserGroups(userRicardo.token)
        .then(list => expect(list)
          .deep.equal({
            name: "Ricardo",
            groups : [
              {
                id: 0,
                name: "acao",
                description: "filmes de acao",
                "number of movies": 1,
                "total-duration" : 152
              },
              {
                id: 1,
                name: "fantasia",
                description: "filmes de fantasia",
                "number of movies": 1,
                "total-duration" : 201
              },
              {
                id: 2,
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number of movies": 1,
                "total-duration" : 154
              }
            ]
          }))
    })
    it('list all groups of user <Rodrigo>', () => {
      return services.listUserGroups(userRodrigo.token)
        .then(list => expect(list)
          .deep.equal({
            name: "Rodrigo",
            groups : [
              {
                id: 0,
                name: "acao",
                description: "filmes de acao",
                "number of movies": 1,
                "total-duration" : 152
              },
              {
                id: 1,
                name: "fantasia",
                description: "filmes de fantasia",
                "number of movies": 1,
                "total-duration" : 201
              },
              {
                id: 2,
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number of movies": 1,
                "total-duration" : 154
              }
            ]
          }))
    })
    it('list all groups of user <Manuel>', () => {
      return services.listUserGroups(userManuel.token)
        .then(list => expect(list)
          .deep.equal({
            name: "Manuel",
            groups : [
              {
                id: 0,
                name: "acao",
                description: "filmes de acao",
                "number of movies": 1,
                "total-duration" : 152
              },
              {
                id: 1,
                name: "fantasia",
                description: "filmes de fantasia",
                "number of movies": 1,
                "total-duration" : 201
              },
              {
                id: 2,
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number of movies": 1,
                "total-duration" : 154
              }
            ]
          }))
    })
  })

  describe('Editing groups by changing its name and description tests', () => {
    it('Edit group <fim de semana> of user <Ricardo>', () => {
      return services.updateGroup(userRicardo.token, "2", {
        name: "ferias de natal", 
        description: "filmes para ver nas ferias de natal"
      })
        .then(update => expect(update)
        .deep.equal({
          id: "2",
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
    it('Edit group <fim de semana> of user <Rodrigo>', () => {
      return services.updateGroup(userRodrigo.token, "2", {
        name: "ferias de natal", 
        description: "filmes para ver nas ferias de natal"
      })
        .then(update => expect(update)
        .deep.equal({
          id: "2",
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
    it('Edit group <fim de semana> of user <Manuel>', () => {
      return services.updateGroup(userManuel.token, "2", {
        name: "ferias de natal", 
        description: "filmes para ver nas ferias de natal"
      })
        .then(update => expect(update)
        .deep.equal({
          id: "2",
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
  })
  // [name, description, total-duration, movies : {id1: {movie-info}, id2: {movie-info}}]
  // const delDarkRicardo = services.deleteMovie(userRicardo.token, "0", "tt0468569")
  // const delRingsRodrigo = services.deleteMovie(userRodrigo.token, "1", "tt0167260")

  /*
  * deleteGroup is not possible to test
  */

  describe('Delete movies tests', () => {
    it('Delete movie <The Dark Knight> of user <Ricardo>', () => {
      return services.deleteMovie(userRicardo.token, 0, "tt0468569")
        .then(delMovie => expect(delMovie)
        .deep.equal({
          title: "The Dark Knight",
          group: [
            {
              name: "acao",
              description: "filmes de acao",
              "total-duration": "152",
              movies: {
                "tt0468569": {
                  id: "tt0468569",
                  title: "The Dark Knight",
                  description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                  runtime: "152",
                  year: "2008",
                  image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6762_AL_.jpg",
                  directors: "Christopher Nolan",
                  actors: "Christian Bale, Heath Ledger, Aaron Eckhart"
                } 
              }
            }
          ]
        }))
    })
    it('Delete movie <The Lord of the Rings: The Return of the King> of user <Rodrigo>', () => {
      return services.deleteMovie(userRodrigo.token, 1, "tt0167260")
        .then(delMovie => expect(delMovie)
        .deep.equal({
          title: "The Lord of the Rings: The Return of the King",
          group: [
            {
              name: "fantasia",
              description: "filmes de fantasia",
              "total-duration": "201",
              movies: {
                "tt0167260": {
                  id: "tt0167260",
                  title: "The Lord of the Rings: The Return of the King",
                  description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
                  runtime: "201",
                  year: "2003",
                  image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6762_AL_.jpg",
                  directors: "Peter Jackson",
                  actors: "Elijah Wood, Viggo Mortensen, Ian McKellen"
                } 
              }
            }
          ]
        }))
    })
  })

  describe('Get details of a group tests', () => {
    it('Get details of the group Fantasia of the user <Ricardo> with the ID <1>', () => {
      return services.getGroupById(userRicardo.token, "1")
        	.then(getGroup => expect(getGroup)
          .deep.equal({
            id: "1",
            name: "fantasia",
            description: "filmes de fantasia",
            "total-duration": 201,
            movies: {
              "tt0167260": {
                id: "tt0167260",
                title: "The Lord of the Rings: The Return of the King",
                description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
                runtime: "201",
                year: "2003",
                image: "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_Ratio0.6762_AL_.jpg",
                directors: "Peter Jackson",
                actors: "Elijah Wood, Viggo Mortensen, Ian McKellen"
              }  
            }
          }))
    })
    it('Get details of the group acao of the user <Manuel> with the ID <0>', () => {
      return services.getGroupById(userManuel.token, "0")
        	.then(getGroup => expect(getGroup)
          .deep.equal({
            id: "0",
            name: "acao",
            description: "filmes de acao",
            "total-duration": 152,
            movies: {
              "tt0468569": {
                id: "tt0468569",
                title: "The Dark Knight",
                description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                runtime: "152",
                year: "2008",
                image: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_Ratio0.6762_AL_.jpg",
                directors: "Christopher Nolan",
                actors: "Christian Bale, Heath Ledger, Aaron Eckhart"
              }  
            }
          }))
    })
  })

  //const removeGroupNatalRicardo = services.getGroupById(userRicardo.token, "2")

  /*
  * removeGroup is not possible to test
  */

  /*describe('remove a group test', () => {
    it('remove group Ferias de Natal of user <Ricardo> with the ID<2>', () => {
      return services.deleteGroup(userRicardo.token, "2")
        .then(removeGroup => expect(removeGroup))
        .deep.equal({
          name: "ferias de natal"
        })
    })
  })*/

});

