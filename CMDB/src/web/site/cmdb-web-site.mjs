
import url from 'url';
import convertToHttpError from '../../../errors/http-errors.mjs';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


function handlerMiddleware(handler){
    return async function(req, resp){
      //console.log(req.user)
        try {
            let view = await handler(req, resp)
            if (view){
                view.data.user = req.user
                resp.render(view.name , view.data) 
            } 
        } catch(e) {
            const response = convertToHttpError(e)
            resp.status(response.status).json(response.body)
            console.log(e)
        }
    }
}

export default function (services){
    if(!services) throw new Error("Invalid parameter services")

    async function getHome(req, resp) {
      if(req.user)
        resp.render('index',{user: req.user})
      else resp.render('index')
    }
  
    async function getCss(req, resp) {
        resp.sendFile(__dirname + "css/site.css",resp);
        
    }

    async function getScript(req,resp){
      resp.sendFile(__dirname +`scripts/${req.params.scriptName}`,resp);
    }

    async function getPopularMovies(req,resp){
        try {
            let max = Object.values(req.query)[0] || 250;
            const popularMovies = await services.getPopularMovies(max);
           
            resp.render('popular', {title : `Top ${max} movies`, movies : popularMovies.results})
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

    async function getMovieById(req, resp){
      try{
        let movieInfo = await services.getMovieById(req.params.movieId)
        let groups = (req.user)? await services.listUserGroups(req.user.token).catch() : undefined;
        // return { name:'movieInfo', data: {title: "CMDB | INFO", groups: groups.groups, movieInfo:movieInfo}}
        return { name:'movieInfo', data: {title: "CMDB | INFO", groups: groups, movieInfo: movieInfo}}

      } catch(error) {
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
        let userGroups = await services.listUserGroups(req.user.token);
  
        console.log(`[>] Successfully retrieved all user's groups.`)
        return {name: "groups", data: {title:"My groups",groups: userGroups,scripts:["delete-group.mjs"]}}
        
      } catch (error) {
        if (!error.code) console.error(error);
        const httpError = convertToHttpError(error);
      }
    }

    async function createGroup(req, resp){
      try {
        if (!req.body.name || !req.body.description){
          resp
            .status(400)
            .json({ error: "[WA] Invalid body request, check valid format." });
            return;
        }
        await services.createGroup(req.user.token, req.body);
  
        console.log(`[>] Successfully created new group.`);
  
        resp.redirect("/groups")
      } catch (error) {
        if (!error.code) console.error(error);
  
        const httpError = convertToHttpError(error);
        resp.status(httpError.status).json(httpError.body);
      }
    }
    
    async function getGroupById(req, resp){
      try {
          let group = await services.getGroupById(
            req.user.token,
            req.params.groupId
          );

          console.log(`[>] Successfully retrieved group info.`)

          console.log(group)

          return { name: 'groupInfo', data: {title:group.name.toUpperCase(), group,scripts:["update-group.mjs","delete-movie.mjs"]}}

        } catch (error) {
          if (!error.code) console.error(error);
  
          const httpError = convertToHttpError(error);
          resp.status(httpError.status).json(httpError.body);
      }
    }

    async function updateGroup(req, resp) {
      try {
        console.log("-- Updating Group --")
        console.log(req)
        await services.updateGroup(req.user.token, req.params.groupId, req.body)

        console.log(`[>] Successfully updated group info.`)

        resp.redirect(`/groups/${req.params.groupId}`)
      }
      catch (error) {
          if (!error.code) console.error(error);
        

      }
    }
   
    async function deleteGroup(req, resp){
      try {
        await services.deleteGroup(req.user.token, req.params.groupId);
        console.log(`[>] Successfully deleted group.`);
        resp.redirect("/groups")
      } catch (error) {
        if (!error.code) console.error(error);
  
        const httpError = convertToHttpError(error);
        resp.status(httpError.status).json(httpError.body);
      }
    }

    // MOVIES
    async function addMovie(req, resp){
      try {
        
        await services.addMovie(req.user.token, req.params.groupId, req.body.movieId);
  
        console.log(`[>] Successfully added movie to group.`);
        
        resp.redirect(`/groups/${req.params.groupId}`)
        // return movie
      } catch (error) {
        if (!error.code) console.error(error);
  
        const httpError = convertToHttpError(error);
        resp.status(httpError.status).json(httpError.body);
      }
    }

    async function deleteMovie(req, resp){
      try {
        let movie = await services.deleteMovie(req.user.token, req.params.groupId, req.params.movieId);
  
        console.log(`[>] Successfully deleted movie from group.`);
  
        resp.redirect(`/groups/${req.params.groupId}`)
      } catch (error) {
          if (!error.code) console.error(error);
    
          const httpError = convertToHttpError(error);
          resp.status(httpError.status).json(httpError.body);
      }
    }
    
    return {
        getHome,
        getCss,
        getScript,
        getPopularMovies,
        searchMovie,
        getMovieById: handlerMiddleware(getMovieById),
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