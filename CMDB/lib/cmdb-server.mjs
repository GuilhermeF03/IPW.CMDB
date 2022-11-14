import express from "express";
import * as webapi from "./cmdb-web-api.mjs";

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

// Lists all user's group
app.get("/groups", webapi.listGroups);

// Create new group providing its name and description (passed on body)
app.post("/groups", webapi.createGroup);

// Get the details of a group, with its name, description, the names and total duration of the included movies
app.get("/groups/:groupId", webapi.getGroupById);

// Edit group by changing its name and description
app.put("/groups/:groupId", webapi.updateGroup);

// Add movie to group
app.put("groups/:groupId/:movieId",webapi.putMovies)

// Remove a movie from a group
app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);

// Delete a group do user
app.delete("/groups/:groupId/", webapi.deleteGroup);

// Create new user
app.post("/user", webapi.createUser);

app.listen(PORT, () =>console.log(`Server listening in http://localhost:${PORT}`));
