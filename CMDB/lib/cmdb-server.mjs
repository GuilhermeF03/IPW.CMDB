import express from "express";
import * as webapi from "./cmdb-web-api.mjs";

const app = express();
const PORT = 8080;

console.log("Setting up server...");

// GENERAL
 app.use(express.json());

app.get("/popular", webapi.getPopularMovies);

app.get("/search/:movieId", webapi.searchMovie);

// USER
app.post("/user", webapi.createUser);

// GROUPS


app.get("/groups", webapi.listGroups);

app.post("/groups", webapi.createGroup);

app.get("/groups/:groupId", webapi.getGroupById);

app.put("/groups/:groupId", webapi.updateGroup);

app.delete("/groups/:groupId/", webapi.deleteGroup);

app.put("groups/:groupId/:movieId",webapi.putMovies)

app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);

app.listen(PORT, () =>console.log(`Server listening in http://localhost:${PORT}`));
