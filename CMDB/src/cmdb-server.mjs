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
import getWebsite from"./web/site/cmdb-web-site.mjs";
import data from "./mem/imdb-movies-data.mjs";
//import mem from "./mem/cmdb-data-elastic.mjs";
import mem from "./mem/cmdb-data-mem.mjs"

// Constants
const PORT = 8080;
const services = getServices(data, mem);
const webapi = getApi(services);
const website = getWebsite(services);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cors());

// View setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'/web', '/site','/views'));

// [API Branch] ------------------------------------------------------------------------------------------------
// GENERAL
app.get("api/popular", webapi.getPopularMovies);
app.get("api/search/", webapi.searchMovie);
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

app.get("/site.css", website.getCss); // done

app.get("/", website.getHome); // done
app.get("/popular", website.getPopularMovies); 
app.get("/search/", website.searchMovie); // done
app.get("/movie/:movieId", website.getMovieById); // done
// USER
app.post("/users", website.createUser); // parte 4
// GROUPS
app.get("/groups", website.listGroups);
app.post("/groups", website.createGroup);

app.get("/groups/:groupId", website.getGroupById);
app.post("/groups/:groupId", website.updateGroup);
// app.delete("/groups/:groupId", website.deleteGroup);
app.post("/groups/:groupId/delete", website.deleteGroup);


app.get("/movies/:movieId", website.getMovieById) // done
app.post("/groups/:groupId/:movieId", website.addMovie);
// app.delete("/groups/:groupId/:movieId", website.deleteMovie);
// já não é preciso o groupId
app.post("/groups/:groupId/:movieId/delete", website.deleteMovie);


// Server boot-up
console.log(`[>] Setting up server...\n
           Error labeling : 
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