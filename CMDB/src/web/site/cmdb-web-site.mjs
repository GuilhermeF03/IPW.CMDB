export default function (services){
    async function getPopularMovies(max){}
    async function searchMovie(movieName){}
    async function getMovieById(movieId)
    // USER
    async function createUser(){ 

    }
    // GROUPS
    async function listGroups(userToken){}
    async function createGroup(userToken, groupInfo){}
    
    async function getGroupById(id){}
    async function updateGroup(){}
    async function deleteGroup(){}
    // MOVIES
    async function addMovie(){}
    async function deleteMovie(){}
    
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