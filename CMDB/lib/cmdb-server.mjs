import express from "express";
import webapi from "./cmdb-web-api.mjs";

const app = express();
const PORT = 8080;

console.log("Start setting us server");
// 
 app.use(express.json());

// Get the list of the most popular movies. The request has an optional parameter to limit the number of returned movies (max 250)
app.get("/popular", webapi.getPopularMovies);


// Search movies by name. The request has an optional parameter to limit the number of returned movies (max 250)
app.get("/search/:movieId", webapi.searchMovie);

// Groups
// Create group providing its name and description passa o nome e a descrição pelo body
app.post("/groups", webapi.createGroup);

// Edit group by changing its name and description
// vamos ter de ir buscar o grupo e fazer uma atualização total
app.put("/groups/:groupId", webapi.updateMovies);

// List all groups do user
app.get("/groups", webapi.listGroups);

// Delete a group do user
app.delete("/groups/:groupId", webapi.deleteGroup);

// Get the details of a group, with its name, description, the names and total duration of the included movies
app.get("/groups/:groupId", webapi.getGroupById);

// Add a movie to a group verificar se o filme existe ou não
// recebe um id de um movie pode inserir o movie pelo body
app.put("/groups/:groupId/:movieId", webapi.addMovies);
// Remove a movie from a group
app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);

// Create new user
app.post("/user", webapi.createUser);



 app.listen(PORT, () =>console.log(`Server listening in http://localhost:${PORT}`));
