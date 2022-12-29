// External imports
  import express from "express";
  import url from 'url'
  import path from 'path'
  import cors from "cors";
  import bodyParser from "body-parser";
  import yaml from "yamljs";
  import swaggerUi from "swagger-ui-express";
  import hbs from "hbs"

// Internal imports
import getServices from "./services/cmdb-services.mjs";
import getApi from "./web/api/cmdb-web-api.mjs";
import data from "./mem/imdb-movies-data.mjs";
import mem from "./mem/cmdb-data-mem.mjs";

// Constants
const PORT = 8081;
const services = getServices(data, mem);
const webapi = getApi(services);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();

// Middlewares
app.use(express.json());
//app.use(app.use(bodyParser.urlencoded({ extended: true })))
app.use(cors());

// View setup
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// [API Branch] ------------------------------------------------------------------------------------------------
// GENERAL
app.get("api/popular", webapi.getPopularMovies);
app.get("api/search/:movieName", webapi.searchMovie);
app.get("api/movie/:movieId", webapi.getMovieById);
// USER
app.post("api/users", webapi.createUser);
// GROUPS
app.get("api/groups", webapi.listGroups);
app.post("api/groups", webapi.createGroup);

app.get("api/groups/:groupId", webapi.getGroupById);
app.put("api/groups/:groupId", webapi.updateGroup);
app.delete("api/groups/:groupId", webapi.deleteGroup);

//app.get("api/groups/:groupId/:movieId", webapi.getMovie);
app.put("api/groups/:groupId/:movieId", webapi.addMovie);
app.delete("api/groups/:groupId/:movieId", webapi.deleteMovie);

// [WEB Branch] ------------------------------------------------------------------------------------------------
// GENERAL
/*app.get("/popular", webapi.getPopularMovies);
app.get("/search/:movieName", webapi.searchMovie);
// USER
app.post("/users", webapi.createUser);
// GROUPS
app.get("dashboard/groups", webapi.listGroups);
app.post("/groups", webapi.createGroup);

app.get("dashboard/groups/:groupId", webapi.getGroupById);
app.put("/groups/:groupId", webapi.updateGroup);
app.delete("/groups/:groupId", webapi.deleteGroup);

app.get("dashboard/movies/:movieId", webapi.getMovie)
app.put("/groups/:groupId/:movieId", webapi.addMovie);
app.delete("/groups/:groupId/:movieId", webapi.deleteMovie);

*/
// Server boot-up
console.log("[>] Setting up server...");
console.log(`Error labeling : 
           [Imdb] -> Imdb API
           [WA] -> Web API
           [Els] -> Elasticsearch API
           [S] -> Server info
           [Ser] -> Services
           [WS] -> Web Site
           [Mem] {deprecated} -> File memory
           [E] -> Other errors
          `)
app.listen(PORT, () => console.log(`[>] Server listening @ http://localhost:${PORT}`) );