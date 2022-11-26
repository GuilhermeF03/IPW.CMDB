import express from "express";

import servicesInit from "./cmdb-services.mjs";
import webApiInit from "./cmdb-web-api.mjs";
import data from "./cmdb-movies-data.mjs";
import mem from "./cmdb-data-mem.mjs";

const app = express();
const PORT = 8080;

console.log("[S] Setting up server...");

const services = servicesInit(data,mem)
const webapi = webApiInit(services)

app.use(express.json());
// GENERAL
app.get("/popular", webapi.getPopularMovies);
app.get("/search", webapi.searchMovie);

// USER
app.post("/user", webapi.createUser);

// GROUPS
app.get("/groups", webapi.listGroups);
app.get("/groups/:groupId", webapi.getGroupById);

app.post("/groups", webapi.createGroup);

app.put("/groups/:groupId", webapi.updateGroup);

app.delete("/groups/:groupId/", webapi.deleteGroup);

app.put("groups/:groupId/:movieId",webapi.addMovie)

app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);

// Boot-up server
app.listen(PORT, () =>console.log(`[S] Server listening in http://localhost:${PORT}`));
