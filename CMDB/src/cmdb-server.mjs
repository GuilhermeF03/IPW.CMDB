// External imports
  import express from "express";
  import url from 'url'
  import path from 'path'
  import cors from "cors";
  import yaml from "yamljs";
  import swaggerUi from "swagger-ui-express";
  import hbs from "hbs"
// Internal imports
  import getServices from "./services/cmdb-services.mjs";
  import getApi from "./web/api/cmdb-web-api.mjs";
  import data from "./mem/imdb-movies-data.mjs";
  import mem from "./mem/cmdb-data-mem.mjs";
//Constants
  const PORT = 8081;
  const services = getServices(data, mem);
  const webapi = getApi(services);
  const app = express();
// Middlewares
  app.use(express.json());
  app.use(app.use(bodyParser.urlencoded({ extended: true })))
  app.use(cors());
// View setup
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  console.log(__dirname);
  app.set('view engine', 'hbs');
  app.set('views', __dirname + '/views');
// [API Branch] ------------------------------------------------------------------------------------------------
  // GENERAL
  app.get("api/popular", webapi.getPopularMovies);
  app.get("api/search/:movieName", webapi.searchMovie);
  // USER
  app.post("api/users", webapi.createUser);
  // GROUPS
  app.get("api/groups", webapi.listGroups);
  app.post("api/groups", webapi.createGroup);

  app.get("api/groups/:groupId", webapi.getGroupById);
  app.put("api/groups/:groupId", webapi.updateGroup);
  app.delete("api/groups/:groupId", webapi.deleteGroup);

  app.put("api/groups/:groupId/:movieId", webapi.addMovie);
  app.delete("api/groups/:groupId/:movieId", webapi.deleteMovie);
// [WEB Branch] ------------------------------------------------------------------------------------------------






// Server boot-up
console.log("[S] Setting up server...");
app.listen(PORT, () => console.log(`[S] Server listening in http://localhost:${PORT}`) );