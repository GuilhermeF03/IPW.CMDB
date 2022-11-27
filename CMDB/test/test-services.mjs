import {expect} from 'chai';

import data from '../lib/cmdb-data-mem.mjs'
import mem from '../lib/cmdb-movies-data.mjs'
import servicesInit from '../lib/cmdb-services.mjs'

const services = servicesInit(data, mem)

describe('Services Tests', () => {

  describe('Get top movies tests', () => {
    it('get 3 top movies', () => {
      const getTop3 = services.getPopularMovies(3);
      return getTop3
        .then(getMovies => expect(getMovies)
          .deep.equal({
            "items": [
              {
                "id": "tt0111161",
                "rank": "1",
                "title": "The Shawshank Redemption",
                "year": "1994",
                "imDbRating": "9.2",
              },
              {
                "id": "tt0068646",
                "rank": "2",
                "title": "The Godfather",
                "year": "1972",
                "imDbRating": "9.2",
              },
              {
                "id": "tt0468569",
                "rank": "3",
                "title": "The Dark Knight",
                "year": "2008",
                "imDbRating": "9.0",
              }
            ]
          }))
    });
  })

  describe('Search all possible movies by a name tests', () => {
    it('get the movie by the title <The Good, the Bad and the Ugly>', () => {
      const search5Movies = services.searchMovie("The Good, the Bad and the Ugly", 5)
      return search5Movies
        .then(searchMovie => expect(searchMovie)
          .deep.equal({
            expression: "The Godfather Part II",
            results: [
              {
                id: "tt0071562",
                title: "The Godfather Part II",
                description: "(1974)"
              },
              {
                id: "tt17566342",
                title: "The Godfather Part II",
                description: "(2021) (Podcast Episode) - Locked on Marlins - Daily Podcast on the Miami Marlins (2020) (Podcast Series)"
              },
              {
                id: "tt0099674",
                title: "The Godfather Part III",
                description: "(1990)"
              },
              {
                id: "tt19829922",
                title: "The Godfather Part III âEUR¢ The Next Reel",
                description: "(2016) (Podcast Episode) - The Next Reel Film Podcast Master Feed (2011) (Podcast Series)"
              },
              {
                id: "tt19830088",
                title: "The Godfather Part II âEUR¢ The Next Reel",
                description: "(2016) (Podcast Episode) - The Next Reel Film Podcast Master Feed (2011) (Podcast Series)"
              },
              {
                id: "tt16077562",
                title: "The Godfather Part II",
                description: "(2023) (Podcast Episode) - Season 5 | Episode 22 - Replay Value (2018) (Podcast Series)"
              }
            ]
          }))
    })
  })

  const createGroupAcaoRicardo = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "0",
    name: "acao",
    description: "filmes de acao",
    movies : {}
  })
  const createGroupFantasiaRicardo = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "1",
    name: "fantasia",
    description: "filmes de fantasia",
    movies: {}
  })
  const createGroupSemanaRicardo = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "2",
    name: "fim de semana",
    description: "filmes para ver no fim de semana",
    movies: {}
  })
  const createGroupAcaoRodrigo = services.createGroup("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", {
    id: "0",
    name: "acao",
    description: "filmes de acao",
    movies : {}
  })
  const createGroupFantasiaRodrigo = services.createGroup("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", {
    id: "1",
    name: "fantasia",
    description: "filmes de fantasia",
    movies: {}
  })
  const createGroupSemanaRodrigo = services.createGroup("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", {
    id: "2",
    name: "fim de semana",
    description: "filmes para ver no fim de semana",
    movies: {}
  })
  const createGroupAcaoManuel = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "0",
    name: "acao",
    description: "filmes de acao",
    movies : {}
  })
  const createGroupFantasiaManuel = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "1",
    name: "fantasia",
    description: "filmes de fantasia",
    movies: {}
  })
  const createGroupSemanaManuel = services.createGroup("20f5410a-49e7-4589-8659-9628e312abd6", {
    id: "2",
    name: "fim de semana",
    description: "filmes para ver no fim de semana",
    movies: {}
  })

  describe('Create groups tests', () => {
    it(`Create group <acao> of user with the token: <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return createGroupAcaoRicardo
        .then(group => expect(group)
          .deep.equal({
            id: "0",
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> of user with the token: <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return createGroupFantasiaRicardo
        .then(group => expect(group)
          .deep.equal({
            id: "1",
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> of user with the token: <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return createGroupSemanaRicardo
        .then(group => expect(group)
          .deep.equal({
            id: "2",
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
    it(`Create group <acao> of user with the token: <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return createGroupAcaoRodrigo
        .then(group => expect(group)
          .deep.equal({
            id: "0",
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> of user with the token: <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return createGroupFantasiaRodrigo
        .then(group => expect(group)
          .deep.equal({
            id: "1",
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> of user with the token: <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return createGroupSemanaRodrigo
        .then(group => expect(group)
          .deep.equal({
            id: "2",
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
    it(`Create group <acao> of user with the token: <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return createGroupAcaoManuel
        .then(group => expect(group)
          .deep.equal({
            id: "0",
            name: "acao",
            description: "filmes de acao"
          }))
    })
    it(`Create group <fantasia> of user with the token: <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return createGroupFantasiaManuel
        .then(group => expect(group)
          .deep.equal({
            id: "1",
            name: "fantasia",
            description: "filmes de fantasia"
          }))
    })
    it(`Create group <fim de semana> of user with the token: <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return createGroupSemanaManuel
        .then(group => expect(group)
          .deep.equal({
            id: "2",
            name: "fim de semana",
            description: "filmes para ver no fim de semana"
          }))
    })
  })

  //The Dark Knight, id : tt0468569
  //The Lord of the Rings: The Return of the King, id : tt0167260
  //Pulp Fiction, id : tt0110912
  const addDarkAcaoRicardo = services.addMovie("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", createGroupAcaoRicardo.id, "tt0468569")
  const addDarkAcaoRodrigo = services.addMovie("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", createGroupAcaoRodrigo.id, "tt0468569")
  const addDarkAcaoManuel = services.addMovie("20f5410a-49e7-4589-8659-9628e312abd6", createGroupAcaoManuel.id, "tt0468569")
  const addRingsFantasiaRicardo = services.addMovie("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", createGroupFantasiaRicardo.id, "tt0167260")
  const addRingsFantasiaRodrigo = services.addMovie("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", createGroupFantasiaRodrigo.id, "tt0167260")
  const addRingsFantasiaManuel = services.addMovie("20f5410a-49e7-4589-8659-9628e312abd6", createGroupFantasiaManuel.id, "tt0167260")
  const addPulpSemanaRicardo = services.addMovie("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", createGroupSemanaRicardo.id, "tt0110912")
  const addPulpSemanaRodrigo = services.addMovie("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", createGroupSemanaRodrigo.id, "tt0110912")
  const addPulpSemanaManuel = services.addMovie("20f5410a-49e7-4589-8659-9628e312abd6", createGroupSemanaManuel.id, "tt0110912")

  describe('Adding movies into a group of an user tests', () => {
    it(`Adding movie <The Dark Knight> into the group <acao> of user with token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return addDarkAcaoRicardo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008"
          }))
    })
    it(`Adding movie <The Dark Knight> into the group <acao> of user with token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return addDarkAcaoRodrigo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008"
          }))
    })
    it(`Adding movie <The Dark Knight> into the group <acao> of user with token <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return addDarkAcaoManuel
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0468569",
            title: "The Dark Knight",
            description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
            runtime: "152",
            year: "2008"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> of user with token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return addRingsFantasiaRicardo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> of user with token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return addRingsFantasiaRodrigo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003"
          }))
    })
    it(`Adding movie <The Lord of the Rings: The Return of the King> into the group <fantasia> of user with token <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return addRingsFantasiaManuel
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0167260",
            title: "The Lord of the Rings: The Return of the King",
            description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
            runtime: "201",
            year: "2003"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> of user with token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>`, () => {
      return addPulpSemanaRicardo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> of user with token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>`, () => {
      return addPulpSemanaRodrigo
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994"
          }))
    })
    it(`Adding movie <Pulp Fiction> into the group <fim de semana> of user with token <20f5410a-49e7-4589-8659-9628e312abd6>`, () => {
      return addPulpSemanaManuel
        .then(movie => expect(movie)
          .deep.equal({
            id: "tt0110912",
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
            runtime: "154",
            year: "1994"
          }))
    })
  })

  const listRicardo = services.listUserGroups("d0ea06ff-4c48-40e7-80df-89ecb05a46bd")
  const listRodrigo = services.listUserGroups("e85d1619-82dc-43bf-bba7-b3e9be6edaa3")
  const listManuel = services.listUserGroups("20f5410a-49e7-4589-8659-9628e312abd6")

  // {name, groups : [{name, description, number-of-movies}]}
  describe('list all groups of users tests', () => {
    it('list all groups of user with token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>', () => {
      return listRicardo
        .then(list => expect(list)
          .deep.equal({
            name: "Ricardo",
            groups : [
              {
                name: "acao",
                description: "filmes de acao",
                "number-of-movies": "1",
                "total-duration" : "152"
              },
              {
                name: "fantasia",
                description: "filmes de fantasia",
                "number-of-movies": "1",
                "total-duration" : "201"
              },
              {
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number-of-movies": "1",
                "total-duration" : "154"
              }
            ]
          }))
    })
    it('list all groups of user with token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>', () => {
      return listRodrigo
        .then(list => expect(list)
          .deep.equal({
            name: "Rodrigo",
            groups : [
              {
                name: "acao",
                description: "filmes de acao",
                "number-of-movies": "1",
                "total-duration" : "152"
              },
              {
                name: "fantasia",
                description: "filmes de fantasia",
                "number-of-movies": "1",
                "total-duration" : "201"
              },
              {
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number-of-movies": "1",
                "total-duration" : "154"
              }
            ]
          }))
    })
    it('list all groups of user with token <20f5410a-49e7-4589-8659-9628e312abd6>', () => {
      return listManuel
        .then(list => expect(list)
          .deep.equal({
            name: "Manuel",
            groups : [
              {
                name: "acao",
                description: "filmes de acao",
                "number-of-movies": "1",
                "total-duration" : "152"
              },
              {
                name: "fantasia",
                description: "filmes de fantasia",
                "number-of-movies": "1",
                "total-duration" : "201"
              },
              {
                name: "fim de semana",
                description: "filmes para ver no fim de semana",
                "number-of-movies": "1",
                "total-duration" : "154"
              }
            ]
          }))
    })
  })
  
  const updateRicardo = services.updateGroup("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", "2", {
    name: "ferias de natal", 
    description: "filmes para ver nas ferias de natal"
  })
  const updateRodrigo = services.updateGroup("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", "2", {
    name: "ferias de natal", 
    description: "filmes para ver nas ferias de natal"
  })
  const updateManuel = services.updateGroup("20f5410a-49e7-4589-8659-9628e312abd6", "2", {
    name: "ferias de natal", 
    description: "filmes para ver nas ferias de natal"
  })

  describe('Editing groups by changing its name and description tests', () => {
    it('Edit group <fim de semana> of user token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>', () => {
      return updateRicardo
        .then(update => expect(update)
        .deep.equal({
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
    it('Edit group <fim de semana> of user token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>', () => {
      return updateRodrigo
        .then(update => expect(update)
        .deep.equal({
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
    it('Edit group <fim de semana> of user token <20f5410a-49e7-4589-8659-9628e312abd6>', () => {
      return updateManuel
        .then(update => expect(update)
        .deep.equal({
          name: "ferias de natal",
          description: "filmes para ver nas ferias de natal"
        }))
    })
  })
  // [name, description, total-duration, movies : {id1: {movie-info}, id2: {movie-info}}]
  const delDarkRicardo = services.deleteMovie("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", "0", "tt0468569")
  const delRingsRodrigo = services.deleteMovie("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", "1", "tt0167260")

  describe('Delete movies tests', () => {
    it('Delete movie <The Dark Knight> of user token <d0ea06ff-4c48-40e7-80df-89ecb05a46bd>', () => {
      return delDarkRicardo
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
                  year: "2008"
                } 
              }
            }
          ]
        }))
    })
    it('Delete movie <The Lord of the Rings: The Return of the King> of user token <e85d1619-82dc-43bf-bba7-b3e9be6edaa3>', () => {
      return delDarkRicardo
        .then(delMovie => expect(delMovie)
        .deep.equal({
          title: "The Lord of the Rings: The Return of the King",
          group: [
            {
              name: "fantasia",
              description: "filmes de fantasia",
              "total-duration": "152",
              movies: {
                "tt0167260": {
                  id: "tt0167260",
                  title: "The Lord of the Rings: The Return of the King",
                  description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
                  runtime: "201",
                  year: "2003"
                } 
              }
            }
          ]
        }))
    })
  })
//"d0ea06ff-4c48-40e7-80df-89ecb05a46bd"
//"e85d1619-82dc-43bf-bba7-b3e9be6edaa3"
//"20f5410a-49e7-4589-8659-9628e312abd6"
  const getGroupAcaoRicardo = services.getGroupById("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", "0")
  const getGroupFantasiaRicardo = services.getGroupById("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", "1")
  const getGroupNatalRicardo = services.getGroupById("d0ea06ff-4c48-40e7-80df-89ecb05a46bd", "2")
  const getGroupAcaoRodrigo = services.getGroupById("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", "0")
  const getGroupFantasiaRodrigo = services.getGroupById("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", "1")
  const getGroupNatalRodrigo = services.getGroupById("e85d1619-82dc-43bf-bba7-b3e9be6edaa3", "2")
  const getGroupAcaoManuel = services.getGroupById("20f5410a-49e7-4589-8659-9628e312abd6", "0")
  const getGroupFantasiaManuel = services.getGroupById("20f5410a-49e7-4589-8659-9628e312abd6", "1")
  const getGroupNatalManuel = services.getGroupById("20f5410a-49e7-4589-8659-9628e312abd6", "2")

  describe('Get details of a group tests', () => {
    it('Get details')
  })
});