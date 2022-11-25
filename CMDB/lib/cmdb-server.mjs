import express from "express";
import * as webapi from "./cmdb-web-api.mjs";

const app = express();
const PORT = 8080;

console.log("[S] Setting up server...");


app.use(express.json());// JSON parser Middleware

// GENERAL
app.use(express.json());
 
app.get("/popular", webapi.getPopularMovies);
app.get("/search/:movieName", webapi.searchMovie);

// USER
app.post("/user", webapi.createUser);

// GROUPS
app.get("/groups", webapi.listGroups);
app.get("/groups/:groupId", webapi.getGroupById);

app.post("/groups", webapi.createGroup);

app.put("/groups/:groupId", webapi.updateGroup);

app.delete("/groups/:groupId/", webapi.deleteGroup);

app.put("groups/:groupId/:movieId",webapi.addMovie)

app.delete("/groups/:groupId/", webapi.deleteGroup);
app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);


// Boot-up server
app.listen(PORT, () =>console.log(`[S] Server listening in http://localhost:${PORT}`));






