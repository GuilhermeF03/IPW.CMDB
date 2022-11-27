/** API - 
 * handles HTTP requests
 * redirects to services module
 */
 import { convertToHttpError } from "../errors/http-errors.mjs";

const user1 = {token : "abcdefg", name : "Kiko", groups: []}
const user2 = {token : "ahgbfir", name : "Marco", groups: [] }

const group1 = {name: "Filmes de natal", description: "Filmes para se ver numa noite de natal", movies: {}}
const group2 = {name : "Filmes da marvel", description : "Filmes para ver no natal", movies: {}}

const movie1 = {title : "Copycat",  description: "the life of a copycat", year : 1970, runtime : 149}
const movie2 = {title: "Hugo the strongman", description : "the life of a strong man", year : 1949, runtime: 137}