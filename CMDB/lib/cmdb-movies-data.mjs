const apiKey = "k_iw34bd1e";
const top250Url = `https://imdb-api.com/en/API/Top250Movies/${apiKey}`;
const searchMovieByNameUrl = `https://imdb-api.com/en/API/SearchMovie/${apiKey}/`;
const getMovieByIdUrl = `https://imdb-api.com/en/API/Title/${apiKey}/`;

async function searchMovieByName(movieName) {
    try {
        return await (await fetch(`${searchMovieByNameUrl}${movieName}`)).json()
    } catch (error) {
        
    }
}
async function getTop250() {
    try {
        return await (await fetch(top250Url)).json()
    } catch (error) {
        
    }
}
async function getMovieById(movieId) {
    try {
        return await(await fetch(`${getMovieByIdUrl}${movieId}`)).json()
    } catch (error) {
        
    }
}

export const data = {
    searchMovieByName,
    getTop250,
    getMovieById,
}

export default data