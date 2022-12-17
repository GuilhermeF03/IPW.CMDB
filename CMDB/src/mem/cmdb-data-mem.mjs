import fs from "node:fs/promises";
import { errors } from "../../errors/http-errors.mjs";

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
    .catch(() => console.error("[fs] File not found"));
};

const writeData = (path, data) => {
  fs.writeFile(path, JSON.stringify(data, null, 2))
    .then(() => console.log("[fs] Data was successfully written!"))
    .catch(() => console.error("[fs] Couldn't finish writing data."));
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.lastIndex = function () {
  return this.length - 1;
};

/* -------------------------------- [USER] -------------------------------------------------------------------------------------------------- */
function createUser(userInfo) {
  return readData(dataPath).then((data) => {
    data[userInfo.token] = {
      token: userInfo.token,
      name: userInfo.name,
      groups: [],
    };
    return Promise.resolve(writeData(dataPath, data));
  });
}

/* -------------------------------- [GROUP] ------------------------------------------------------------------------------------------------- */
function createGroup(userToken, groupInfo) {
  return readData(dataPath).then((data) => {
    if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());
    groupInfo["total-duration"] = 0;
    groupInfo.movies = {};

    data[userToken].groups.push(groupInfo); 

    let group = data[userToken].groups.last();
    writeData(dataPath, data);

    return {
      id: data[userToken].groups.lastIndex(),
      name: group.name,
      description: group.description,
    };
  });
}

function listUserGroups(userToken) {
  return readData(dataPath).then((data) => {
    if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());

    let groups = data[userToken].groups.map(
      (elem) =>
        (elem = {
          name: elem.name,
          description: elem.description,
          "number of movies": Object.keys(elem.movies).length,
          "total-duration": elem["total-duration"],
        })
    );

    if (!groups) throw new Error("[Mem] No groups found");
  
    return { name: data[userToken].name, groups };

  });
}

function getGroupById(userToken, groupId) {
  return readData(dataPath)
    .then((data) => {
      if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());
      if (groupId >= data[userToken].groups.length) return Promise.reject(errors.NOT_FOUND(`[Mem] Group with id <${groupId}> could not be found.`));

      let group = data[userToken].groups[groupId]  

      if (!group)
      return Promise.reject(errors.NOT_FOUND("[Mem] The group you were trying to find does not exist."))

      return group;
    })
}

function updateGroup(userToken, groupId, updateInfo) {
  return readData(dataPath)
    .then((data) => {
      if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());
      if (groupId >= data[userToken].groups.length) return Promise.reject(errors.NOT_FOUND(`[Mem] Group with id <${groupId}> could not be found.`));


      const group = data[userToken].groups[groupId];
      if (!group) return Promise.reject(errors.NOT_FOUND())


      group.name = updateInfo.name;
      group.description = updateInfo.description;

      writeData(dataPath, data);

      delete group.movies;
      delete group["total-duration"];
      return group;
    })
}

function deleteGroup(userToken, groupId) {
  return readData(dataPath)
    .then((data) => {
      if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());
      if (groupId >= data[userToken].groups.length)
        return Promise.reject(errors.NOT_FOUND(`[Mem] Group with id <${groupId}> could not be found.`));

      if(groupId >= data[userToken].groups.length) throw new Error("[Mem] Group not found");

      data[userToken].groups.splice(groupId, 1);
      writeData(dataPath, data);
    })
}

/* --------------------------------- [MOVIE] ------------------------------------------------------------------------------------------------ */
function addMovie(userToken, groupId, mInfo) {
  return readData(dataPath).then((data) => {
    if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());

    if (groupId >= data[userToken].groups.length)
      return Promise.reject(errors.NOT_FOUND(`[Mem] Group with id <${groupId}> could not be found.`));

    let group = data[userToken].groups[groupId];
    let movie = group.movies[mInfo.id];

    if (movie)
      return Promise.reject(
        errors.BAD_REQUEST("[Mem] The movie you're trying to add was already added.")
      );

    group.movies[mInfo.id] = mInfo;
    group["total-duration"] += parseInt(mInfo.runtime);

    writeData(dataPath, data);

    return mInfo;
  });
}

function deleteMovie(userToken, groupId, movieId) {
  return readData(dataPath)
    .then((data) => {
      if (!data[userToken]) return Promise.reject(errors.NOT_AUTHORIZED());
      if (groupId >= data[userToken].groups.length)
        return Promise.reject(errors.NOT_FOUND(`[Mem] Group with id <${groupId}> could not be found.`));

      let group = data[userToken].groups[groupId];
      let movie = group.movies[movieId];

      if (!movie) return Promise.reject(errors.BAD_REQUEST());

      group["total-duration"] -= parseInt(movie.runtime);

      delete group.movies[movieId];
      writeData(dataPath, data);
    })
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
};
