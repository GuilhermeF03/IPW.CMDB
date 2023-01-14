// External imports
import express from "express";
import url from "url";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import yaml from "yamljs";
import swaggerUi from "swagger-ui-express";
import hbs from "hbs";
// Internal imports
import getServices from "./services/cmdb-services.mjs";
import getAuth from "./web/site/auth/web-auth.mjs";
import getApi from "./web/api/cmdb-web-api.mjs";
import getWebsite from "./web/site/cmdb-web-site.mjs";
import data from "./mem/imdb-movies-data.mjs";
import mem from "./mem/cmdb-data-elastic.mjs";
// import mem from "./mem/cmdb-data-mem.mjs"

// Constants
const PORT = 8080;
const services = getServices(data, mem);
const authRouter = getAuth(services);
const webapi = getApi(services);
const website = getWebsite(services);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();
// const authRouter = authUIFunction(services);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", authMW);
app.use(authRouter)

app.use(cors());
//app.use((req, rsp) => { rsp.status(404).render('notfound') })
//app.use((req, rsp) => { rsp.status(400).console.log(rsp) })

// View setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/web", "/site", "/views"));

// [API Branch] ------------------------------------------------------------------------------------------------
// GENERAL
app.get("/api/popular", webapi.getPopularMovies);
app.get("/api/search/", webapi.searchMovie);
app.get("/api/movie/:movieId", webapi.getMovieById);
// USER
app.post("/api/users", webapi.createUser);
// GROUPS
app.get("/api/groups", webapi.listGroups);
app.post("/api/groups", webapi.createGroup);

app.get("/api/groups/:groupId", webapi.getGroupById);
app.put("/api/groups/:groupId", webapi.updateGroup);
app.delete("/api/groups/:groupId", webapi.deleteGroup);

//app.get("api/groups/:groupId/:movieId", webapi.getMovie);
app.put("/api/groups/:groupId/:movieId", webapi.addMovie);
app.delete("/api/groups/:groupId/:movieId", webapi.deleteMovie);

// [WEB Branch] ------------------------------------------------------------------------------------------------
// GENERAL
app.get("/site.css", website.getCss); // done
app.get("/scripts/:scriptName", website.getScript);

app.get("/", website.getHome); // done
app.get("/popular", website.getPopularMovies);
app.get("/search/", website.searchMovie); // done
app.get("/movie/:movieId", website.getMovieById); // done
// // USER
app.post("/users", website.createUser); // parte 4
// // GROUPS
app.get("/groups", website.listGroups);
app.post("/groups", website.createGroup);

app.get("/groups/:groupId", website.getGroupById);
// app.post("/groups/:groupId/update", website.updateGroup);
app.put("/groups/:groupId", website.updateGroup);

app.post("/groups/:groupId/delete", website.deleteGroup);
app.delete("/groups/:groupId", website.deleteGroup);

app.get("/movies/:movieId", website.getMovieById); // done
app.post("/groups/:groupId", website.addMovie);
// app.post("/groups/:groupId/:movieId/delete", website.deleteMovie);
app.delete("/groups/:groupId/:movieId", website.deleteMovie);

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
          `);
          
function authMW(req, resp, next) {
  if (!req.user) {
    let userToken = req.get("Authorization");
    userToken = userToken ? userToken.split(" ")[1] : null;
    if (!userToken)
      return resp.status(400).json({ error: `[WA] User token not provided` });
    else req.user = { token: userToken };
  }
  next();
}

app.listen(PORT, () =>
  console.log(`[>] Server listening @ http://localhost:${PORT}`)
);
