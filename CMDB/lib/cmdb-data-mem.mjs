import fs from "node:fs/promises";
import { errors } from "../errors/http-errors.mjs";

const dataPath = "CMDB/data/data.json";

/* ------------------------------ [FILE] ------------------------------------------------------------------------------------------------------- */
function checkFileExists(file) {
  return fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

checkFileExists(dataPath)
  .then((exists) => {
    if (!exists) {
      writeData(dataPath, {});
    }
  })
  .catch((error) => console.error(error));

const readData = (path) => {
  return fs
    .readFile(path)
    .then((data) => JSON.parse(data))
    .catch("File not found");
};

const writeData = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2))
    .then()
    .catch((error) => console.error("error:" + error));
};

function validateUser(token) {
  return readData(dataPath)
    .then((data) => {
      if (!data[token]) return Promise.reject(errors.NOT_AUTHORIZED);
    })
    .catch((error) => console.error(error));
}

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.lastIndex = function () {
  return this.length - 1;
};

/* -------------------------------- [USER] -------------------------------------------------------------------------------------------------- */
function createUser(userInfo) {
  return readData(dataPath)
    .then((data) => {
      data[userInfo.token] = {
        token: userInfo.token,
        name: userInfo.name,
        groups: [],
      };
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

/* -------------------------------- [GROUP] ------------------------------------------------------------------------------------------------- */
function createGroup(userToken, groupInfo) {
  return readData(dataPath)
    .then((data) => {
      groupInfo["total-duration"] = 0;
      groupInfo.movies = {}; // create movie

      data[userToken].groups.push(groupInfo); // name groups[]

      let group = data[userToken].groups.last();
      writeData(dataPath, data);

      return {
        id: data[userToken].groups.lastIndex(),
        name: group.name,
        description: group.description,
      };
    })
    .catch((error) => console.error(error));
}

function listUserGroups(userToken) {
  return readData(dataPath)
    .then((data) => {
      let groups = data[userToken].groups
        .map((elem) => elem = {
          name: elem.name,
          description: elem.description,
          "number of movies" : Object.keys(elem.movies).length,
          "total-duration": elem["total-duration"],
       });
      console.log(groups);
      return { name: data[userToken].name, groups };
    })
    .catch((error) => console.error(error));
}

function getGroupById(userToken, groupId) {
  return readData(dataPath)
    .then((data) => data[userToken].groups[groupId])
    .catch((error) => {
      console.error(error);
    });
}

function updateGroup(userToken, groupId, updateInfo) {
  return readData(dataPath)
    .then((data) => {
      const group = data[userToken].groups[groupId];

      group.name = updateInfo.name;
      group.description = updateInfo.description;

      writeData(dataPath, data);

      delete group.movies;
      delete group["total-duration"];
      return group;
    })
    .catch((error) => console.error(error));
}

function deleteGroup(userToken, groupId) {
  return readData(dataPath)
    .then((data) => {
      data[userToken].groups.splice(groupId, 1);
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

/* --------------------------------- [MOVIE] ------------------------------------------------------------------------------------------------ */
function addMovie(userToken, groupId, mInfo) {
  return readData(dataPath)
    .then((data) => {
      let group = data[userToken].groups[groupId];
      let movie = group.movies[mInfo.id];

      if (movie) return Promise.reject(errors.BAD_REQUEST);

      group.movies[mInfo.id] = mInfo
      group["total-duration"] += parseInt(mInfo.runtime);
      
      writeData(dataPath, data);

      return mInfo;
    })
    .catch((error) => console.error(error));
}

function deleteMovie(userToken, groupId, movieId) {
  return readData(dataPath)
    .then((data) => {
      let group = data[userToken].groups[groupId];
      let movie = group.movies[movieId];

      if (!movie) return Promise.reject(errors.BAD_REQUEST);

      group["total-duration"] -= parseInt(movie.runtime);

      delete group.movies[movieId];
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

export default {
  createUser,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
  validateUser,
};
