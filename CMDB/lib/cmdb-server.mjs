import express from "express";
import webapi from "./cmdb-web-api.mjs";

const app = express();
const PORT = 8080;

console.log("Start setting us server");

app.use(express.json());

// Get the list of the most popular movies. The request has an optional parameter to limit the number of returned movies (max 250)
app.get("/popular", webapi.getPopularMovies);

// Search movies by name. The request has an optional parameter to limit the number of returned movies (max 250)
app.get("/search/:movie", webapi.searchMovie);

// Groups
// Create group providing its name and description
app.post("/groups", webapi.createGroup);

// Edit group by changing its name and description
app.put("/groups/:id", webapi.updateMovies);

// List all groups
app.get("/groups", webapi.listGroups);

// Delete a group
app.delete("/groups/:id", webapi.deleteGroup);

// Get the details of a group, with its name, description, the names and total duration of the included movies
app.get("/groups/:id", webapi.getMoviesById);

// Add a movie to a group
app.put("/groups/:group_id/add-movie", webapi.putMovies);

// Remove a movie from a group
app.delete("/groups/:group-id/:movie-id", webapi.deleteGroup);

// Create new user
app.post("/user", webapi.createUser);

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`)) ;
