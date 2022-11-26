import fs from "node:fs/promises";
import { errors } from "../errors/http-errors.mjs";

const dataPath = "CMDB/data/data.json";

// Auxilliary Functions
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
      console.log("File Created");
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
      if (!data[token]) Promise.reject(errors.NOT_AUTHORIZED);
    })
    .catch((error) => console.error(error));
}

Array.prototype.last = () => {
  return this[this.length - 1];
};
Array.prototype.lastIndex = () => {
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
      let groups = data[userToken].groups.map((elem) => {
        elem["number of movies"] = Object.keys(elem.movies).length;
        delete elem.movies;
      });
      return { name: `${data[userToken].name}'s groups`, groups };
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
      let group = getGroupById(userToken, groupId);
      group = updateInfo;
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
      data[userToken].groups.slice(groupId, 1);
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

/* --------------------------------- [MOVIE] ------------------------------------------------------------------------------------------------ */
function addMovie(userToken, groupId, mInfo) {
  return readData(dataPath).then((data) => {
    let group = getGroupById(userToken, groupId);
    let movie = group.movies[mInfo.id];

    if (movie) throw Promise.reject(errors.BAD_REQUEST);

    movie = mInfo;

    group["total-duration"] += movie.runtime;

    writeData(dataPath, data);

    return { groupName: group.name, id: groupId, movieInfo: movie };
  });
}

function deleteMovie(userToken, groupId, movieId) {
  return readData(dataPath)
    .then((data) => {
      let group = getGroupById(userToken, groupId);
      let movie = group.movies[movieId];

      if (!movie) throw Promise.reject(errors.BAD_REQUEST);

      group["total-duration"] -= movie.runtime;

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
