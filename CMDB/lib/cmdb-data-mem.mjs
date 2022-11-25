import fs from "node:fs/promises";

const dataPath = "../data/data.json";
// TODO: verificar erro
const writeData = (path, data) => {
  fs.writeFile(path, JSON.stringify(obj, null, 2))
    .then(() => console.log("File written"))
    .catch((error) => console.error(error));
};

Array.prototype.last = () => {
  return this[this.length - 1];
};
Array.prototype.lastIndex = () => {
  return this.length - 1;
};

// Create data.json file when module is imported
const setData = () => {
  let data = new File(dataPath);
  if (!data.exists()) {
    fs.writeFile(dataPath);
  }
};
setData();

function createUser(userInfo) {
  return readData(dataPath)
    .then((data) => {
      data[userInfo.token] = { name: userInfo.name, groups: [] };
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

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
      data[userToken].groups[groupId] = updateInfo;
      writeData(dataPath, data);

      let group = data[userToken].groups[groupId];

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

function listUserGroups(userToken) {
  return readData(dataPath)
    .then((data) => {
      data[userToken];
    })
    .catch((error) => console.error(error));
}

function deleteMovie(userToken, groupId, movieId) {
  return readData(dataPath)
    .then((data) => {
      if (!data[`${userToken}`].groups[groupId].movies.movieId)
        throw new Error("[mem] Movie not found");

      let movie = data[`${userToken}`].groups[groupId].movies[movieId];

      data[userToken].groups[groupId]["total-duration"] -= movie.duration;

      delete data[userToken].groups[groupId].movies[movieId];
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

function addMovie(userToken, groupId, mInfo) {
  return readData(dataPath).then((data) => {
    if (!!data[`${userToken}`].groups[groupId].movies[mInfo.id])
      throw new Error("[mem] Movie already exists");

    data[userToken].groups[groupId].movies[mInfo.id] = mInfo;

    let movie = data[`${userToken}`].groups[groupId].movies[mInfo.id];

    data[userToken].groups[groupId]["total-duration"] += movie.duration;

    delete movie.id;
    writeData(dataPath, data);
    return movie;
  });
}

// Additional Functions
const readData = (path) => {
  return fs
    .readFile(path)
    .then((data) => JSON.parse(data))
    .catch("File not found");
};


function validateUser(token) {
  return readData(dataPath)
    .then((data) => {
      if (!data[token]) throw error("Invalid user");
    })
    .catch((error) => console.error(error));
}

const dataMemory = {
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

export default dataMemory;
