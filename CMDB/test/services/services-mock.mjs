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
        if (!(typeof value == "string" && value != ""))
            return Promise.reject(errors.BAD_REQUEST());
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
        if(userToken && groupId)
        {
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
        let uInfo = { token: crypto.randomUUID(), username: userInfo.username, password: userInfo.password };
        await mem.createUser(uInfo)
        return uInfo;
    }

    async function validateUser(username, password)
    {
        const user = await mem.validateUser(username, password);
        return user
    }

  /* ---------------------- [GROUPS] -------------------------------------------------------------------------------------------------------- */
    const createGroup = async(userToken, groupInfo) => 
    {
        await validateString(userToken)
        await validateString(groupInfo.name)
        await validateString(groupInfo.description)
        await mem.createGroup(userToken, groupInfo);
    }
    const listUserGroups = async(userToken) => 
    {
        await validateString(userToken)
        await mem.listUserGroups(userToken);
    }
    const getGroupById = async (userToken, groupId) => 
    {
        await validateString(userToken)
        if(isNaN(groupId))
            await validateString(groupId);
        await mem.getGroupById(userToken, groupId);
    }
    async function updateGroup(userToken, groupId, updateInfo) 
    {
        // Validate Info
        await validateString(userToken)
        if(isNaN(groupId))
            await validateString(groupId);
        await validateString(updateInfo.name);
        await validateString(updateInfo.description);
        await mem.updateGroup(userToken, groupId, updateInfo);
    }

    const deleteGroup = async(userToken, groupId) => 
    {
        await validateString(userToken)
        if(isNaN(groupId))
            await validateString(groupId);
        await mem.deleteGroup(userToken, groupId);
    }

  /* ---------------------- [MOVIES] -------------------------------------------------------------------------------------------------------- */
    async function addMovie(userToken, groupId, movieId)
    {
        await validateString(userToken)
        if(isNaN(groupId))
            await validateString(groupId);
        let mInfo = await data.getMovieById(movieId);
        await mem.addMovie(userToken, groupId, mInfo);
    }

    const deleteMovie = async (userToken, groupId, movieId) => 
    {
        await validateString(userToken)
        if(isNaN(groupId))
            await validateString(groupId);
        await getMovieById(userToken, groupId, movieId);
        await mem.deleteMovie(userToken, groupId, movieId);
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
