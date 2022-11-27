import { convertToHttpError } from "../errors/http-errors.mjs";

// AUX FUNCTION
function verifyAuthentication(handlerFunction) {
  return function (req, resp) {
    let userToken = req.get("Authorization");
    userToken = userToken ? userToken.split(" ")[1] : null;

    if (!userToken)
      return resp.status(400).json({ error: `User token not provided` });

    req.userToken = userToken;
    handlerFunction(req, resp);
  };
}

export default function (services) {
  if (!services) throw new Error("[wa] Services module not provided");

  /* ----------------------------- [GENERAL] -------------------------------------------------------------------------------------------------- */
  async function getPopularMovies(req, resp) {
    try {
      let max = Object.values(req.query)[0] || 250;
      const popularMovies = await services.getPopularMovies(max);
      resp.status(200).json({
        status: `Retrieved top ${max} movies.`,
        movies: popularMovies,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function searchMovie(req, resp) {
    try {
      const max = req.query.max || 250;
      const search = await services.searchMovie(req.params.movieName, max);

      if (search.results.size == 0)
        return resp
          .status(200)
          .json({ error: `No results for '${req.params.movieName}'.` });

      resp.status(200).json({
        status: `Returned ${search.results.length} results for '${req.params.movieName}'.`,
        results: search.results,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function createUser(req, resp) {
    try {
      if (Object.keys(req.body).length == 0)
        return resp
          .status(400)
          .json({ message: "No user info was provided. Try again." });

      let newUser = await services.createUser(req.body);

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

  /* --------------------------- [GROUP] ---------------------------------------------------------------------------------------------------- */
  async function createGroupInternal(req, resp) {
    try {
      if (!req.body.name || !req.body.description)
        return resp
          .status(400)
          .json({ error: "Invalid body request, check valid format." });

      let newGroup = await services.createGroup(req.userToken, req.body);

      resp.status(201).json({
        status: `Group created with id: <${newGroup.id}>, name: <${newGroup.name}> and description: <${newGroup.description}>`,
        content: undefined,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function listGroupsInternal(req, resp) {
    try {
      let userGroups = await services.listUserGroups(req.userToken);

      resp.status(200).json({
        status: `Retured all ${userGroups.groups.length} <${userGroups.name}>'s groups`,
        "user-groups": userGroups.groups,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function getGroupByIdInternal(req, resp) {
    try {
      let group = await services.getGroupById(
        req.userToken,
        req.params.groupId
      );
      resp.status(200).json({
        status: `The group <${group.name}>, with id <${req.params.groupId}>, was successfully retrieved.`,
        "group-info": group,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function updateGroupInternal(req, resp) {
    try {
      let updatedGroup = await services.updateGroup(
        req.userToken,
        req.params.groupId,
        req.body
      );

      resp.status(200).json({
        status: `Group with id <${req.params.groupId}> was successfully updated.`,
        "updated-info": updatedGroup,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function deleteGroupInternal(req, resp) {
    try {
      let deletedGroup = await services.deleteGroup(
        req.userToken,
        req.params.groupId
      );
      resp.status(200).json({
        status: `${deletedGroup.name} was successfully removed from groups list.`,
        content: undefined,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  /* --------------------------- [MOVIE] ---------------------------------------------------------------------------------------------------- */
  async function addMovieInternal(req, resp) {
    try {
      let movieInfo = await services.addMovie(
        req.userToken,
        req.params.groupId,
        req.params.movieId
      );

      let groupInfo = await services.getGroupById(
        req.userToken,
        req.params.groupId
      );

      resp.status(200).json({
        status: `<${movieInfo.title}>, with id <${movieInfo.id}>, was successfully added to <${groupInfo.name}>.`,
        "movie-info": movieInfo,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  async function deleteMovieInternal(req, resp) {
    try {
      let deletedMovie = await services.deleteMovie(
        req.userToken,
        req.params.groupId,
        req.params.movieId
      );
      resp.status(200).json({
        status: `${deletedMovie.title} was successfully removed from <${deletedMovie.group.name}>.`,
      });
    } catch (error) {
      if (!error.code) console.error(error);

      const httpError = convertToHttpError(error);
      resp.status(httpError.status).json(httpError.body);
    }
  }

  return {
    // This handlers don't require any user token
    getPopularMovies,
    searchMovie,
    createUser,

    // Each handler requires a user token, token is validated on 'services' module
    createGroup: verifyAuthentication(createGroupInternal),
    updateGroup: verifyAuthentication(updateGroupInternal),
    listGroups: verifyAuthentication(listGroupsInternal),
    deleteGroup: verifyAuthentication(deleteGroupInternal),
    deleteMovie: verifyAuthentication(deleteMovieInternal),
    addMovie: verifyAuthentication(addMovieInternal),
    getGroupById: verifyAuthentication(getGroupByIdInternal),
  };
}
