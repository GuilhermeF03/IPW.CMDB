export default function (services){

    async function getHome(req, resp) {
        sendFile('index.html', resp);
    }
  
    async function getCss(req, resp) {
        sendFile('site.css', resp);
    }

    async function getPopularMovies(req,resp){
        
    }

    async function searchMovie(req, resp){

    }

    async function getMovieById(req, resp){

    }
    // USER
    async function createUser(req, resp){ 

    }
    // GROUPS
    async function listGroups(req, resp){

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

    async function deleteMovie(req, resp){

    }
    
    return {
        getPopularMovies,
        searchMovie,
        getMovieById,
        createUser,
        listGroups,
        createGroup,
        getGroupById,
        updateGroup,
        deleteGroup,
        addMovie,
        deleteMovie,
    }
}