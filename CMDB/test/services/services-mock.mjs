import { errors } from "../../errors/http-errors.mjs";
import crypto from "node:crypto";

const MAX_LIMIT = 250;
const range = (max) => Array.from(Array(max + 1).keys()).slice(1, max + 1);

export default function (data, mem) {
  /* ----------------- [AUX] ------------------------------------------------------------------------------------------------------------------- */
    if (!data)
        throw new Error("[Ser] Data module not provided");
    if (!mem)
        throw new Error("[Ser] Mem module not provided");
    async function validateMaxMovies(max) 
    {
        if (isNaN(max) || !range(MAX_LIMIT).includes(max))
            return Promise.reject(errors.BAD_REQUEST());
    }

    async function validateString(value) 
    {   
        if(typeof value != 'string' || value =='')
            return Promise.reject(errors.BAD_REQUEST());
    }
    async function validateNumeric(value)
    {
        if(isNaN(value) || !Number.isInteger(value))
            return Promise.reject(errors.BAD_REQUEST());
    }
    async function validateId(value)
    {
        try{await validateNumeric(value);}
        catch (err)
        { if(err.code == errors.BAD_REQUEST().code)
            await validateString(value)
          else return Promise.reject(err);
        } 
    }

  /* ---------------------- [GENERAL] ------------------------------------------------------------------------------------------------------- */
    async function getPopularMovies(max) 
    {
        await validateMaxMovies(max);
        let topMovies = await data.getTop250();
        topMovies.results.splice(max, MAX_LIMIT - max);
        if (topMovies.results.length == 0)
            return Promise.reject(errors.NOT_FOUND());
        return topMovies;
    }

    async function searchMovie(movieName, max) 
    {
        await validateMaxMovies(max);
        await validateString(movieName);
        const movies = await data.searchMovieByName(movieName);
        movies.results.splice(max, MAX_LIMIT - max);
        return movies;
    }
    async function getMovieById(userToken, groupId, movieId,)
    { 
        if(userToken != undefined && groupId != undefined)
        {
            await validateId(userToken);
            await validateId(groupId);
            let movie = await mem.getMovieById(userToken, groupId, movieId);
            if(movie) return movie
        }
        return await data.getMovieById(movieId);
    }

  /* ------------------------ [USER] --------------------------------------------------------------------------------------------------------- */
    async function createUser(userInfo) 
    {
        await validateString(userInfo.username);
        await validateString(userInfo.password);
        userInfo.token = crypto.randomUUID()
        return await mem.createUser(userInfo)
    }

    async function validateUser(username, password)
    {
        await validateString(username)
        await validateString(password)
        const user = await mem.validateUser(username, password);
        return user
    }

  /* ---------------------- [GROUPS] -------------------------------------------------------------------------------------------------------- */
    const createGroup = async(userToken, groupInfo) => 
    {
        await validateId(userToken)
        await validateString(groupInfo.name)
        await validateString(groupInfo.description)
        return await mem.createGroup(userToken, groupInfo);
    }
    const listUserGroups = async(userToken) => 
    {
        await validateId(userToken)
        return await mem.listUserGroups(userToken);
    }
    const getGroupById = async (userToken, groupId) => 
    {
        await validateId(userToken)
        await validateId(groupId);
        return await mem.getGroupById(userToken, groupId);
    }
    async function updateGroup(userToken, groupId, updateInfo) 
    {
        // Validate Info
        await validateId(userToken)
        await validateId(groupId)
        await validateString(updateInfo.name);
        await validateString(updateInfo.description);
        return await mem.updateGroup(userToken, groupId, updateInfo);
    }

    const deleteGroup = async(userToken, groupId) => 
    {
        await validateId(userToken)
        await validateId(groupId)
        return await mem.deleteGroup(userToken, groupId);
    }

  /* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
    async function addMovie(userToken, groupId, movieId)
    {
        await validateId(userToken)
        await validateId(groupId)
        await validateString(movieId)
        console.log('SEARCHING MEM...')
        let mInfo = await mem.searchMovieById(movieId);
        if(!mInfo)
        {
            console.log("SEARCHING IMDB...")
            mInfo = await data.getMovieById(movieId);
        }
        return await mem.addMovie(userToken, groupId, mInfo);
    }

    const deleteMovie = async (userToken, groupId, movieId) => 
    {
        await validateId(userToken)
        await validateId(groupId)
        return await mem.deleteMovie(userToken, groupId, movieId);
    }

    return (
    {
        getPopularMovies,
        searchMovie,
        getMovieById,
        createUser,
        validateUser,
        createGroup,
        updateGroup,
        listUserGroups,
        deleteGroup,
        deleteMovie,
        addMovie,
        getGroupById,
    });
}
