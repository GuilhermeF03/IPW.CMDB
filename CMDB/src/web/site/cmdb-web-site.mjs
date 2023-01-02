
import url from 'url';
import convertToHttpError from '../../../errors/http-errors.mjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


function handlerMiddleware(handler){
    const HAMMER_TOKEN = "276381264wgdgw72361-1";

    return async function(req, resp){
        req.token = HAMMER_TOKEN
        try {
            let view = await handler(req, resp)
            if(view) 
                resp.render(view.name , view.data) 
        } catch(e) {
            // TODO: Hammer time again. We are in an HTML response format
            // returning errors in Json format
            const response = convertToHttpError(e)
            resp.status(response.status).json(response.body)
            console.log(e)
        }
    }
}

export default function (services){

    async function getHome(req, resp) {
        resp.render('index')
        //sendFile('index.html', resp);
    }
  
    async function getCss(req, resp) {
        resp.sendFile(__dirname + "css/site.css",resp);
        //let data = f
    }

    async function getPopularMovies(req,resp){
        try {
            let max = Object.values(req.query)[0] || 250;
            const popularMovies = await services.getPopularMovies(max);

            resp.render('popular', {title : `Top ${max} movies`, movies : popularMovies})
          } catch (error) {
            if (!error.code) console.error(error);
      
            const httpError = convertToHttpError(error);
            resp.status(httpError.status).json(httpError.body);
          }
    }

    async function searchMovie(req, resp){
        try {
            const max = req.query.max || 250
            const search = await services.searchMovie(req.query.movieName, max);
      
            console.log(`[>] Successfully retrived top ${max} results for ${req.query.movieName}.`)
      
            resp.render('search', {title: "CMDB - Search", results: search.results})
          } catch (error) {
            if (!error.code) console.error(error);
      
            const httpError = convertToHttpError(error);
            resp.status(httpError.status).json(httpError.body);
          }
    }
   
    // USER TODO
    async function createUser(req, resp){ 
        try {
            if (Object.keys(req.body).length == 0)
              return resp
                .status(400)
                .json({ message: "[WA] No user info was provided. Try again." });
      
            let newUser = await services.createUser(req.body);
      
            console.log(`[>] Successfully created new user.`)
      
            resp.status(201).json({
              status: `User <${newUser.name}> was successfully created with token <${newUser.token}>`,
              "user-info": newUser,
            });
      
          } catch (error) {
            if (!error.code) console.error(error);
      
            const httpError = convertToHttpError(error);
            resp.status(httpError.status).json(httpError.body);
          }
    }
    // GROUPS
    async function listGroups(req, resp){
      try {
        let userGroups = await services.listUserGroups(req.userToken);
  
        console.log(`[>] Successfully retrieved all user's groups.`)
  
        return {name: "groups", data: {title:"My groups",groups: userGroups}}
      } catch (error) {
        if (!error.code) console.error(error);
  
        const httpError = convertToHttpError(error);
        resp.status(httpError.status).json(httpError.body);
      }
    }

    async function createGroup(req, resp){

    }
    
    async function getGroupById(req, resp){

    }

    async function updateGroup(req, resp){

    }

    async function deleteGroup(req, resp){

    }

    // MOVIES
    async function addMovie(req, resp){

    }

    async function getMovieById(req, resp){

    }

    async function deleteMovie(req, resp){

    }
    
    return {
        getHome,
        getCss,
        getPopularMovies,
        searchMovie,
        getMovieById,
        createUser,
        listGroups : handlerMiddleware(listGroups),
        createGroup: handlerMiddleware(createGroup),
        getGroupById :handlerMiddleware(getGroupById),
        updateGroup : handlerMiddleware(updateGroup),
        deleteGroup : handlerMiddleware(deleteGroup),
        addMovie : handlerMiddleware(addMovie),
        getMovieById : handlerMiddleware(getMovieById),
        deleteMovie: handlerMiddleware(deleteMovie)
    }
}