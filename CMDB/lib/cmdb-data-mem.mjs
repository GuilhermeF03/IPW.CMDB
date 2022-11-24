import { read } from "node:fs";
import fs from "node:fs/promises";

const dataPath = "../data/data.json";

function createUser(userInfo) {
  return readData(dataPath)
    .then((data) => {
      data[`${userInfo.token}`] = { name: userInfo.name, groups: [] };
      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
  // outra possibilidade com async await
  // try {
  //   let data = await readData(dataPath);

  //   data[`${userInfo.token}`] = { name: userInfo.name, groups: [] };

  //
  //   // aqui é uma void function
  //   return data[`${userInfo.token}`];
  // } catch (error) {
  //   console.error(error);
  //   throw error;
}

function createGroup(userToken, groupInfo) {
  return readData(dataPath)
    .then((data) => {
      data[`${userToken}`].groups.push(groupInfo);

      writeData(dataPath, data);
      return data[`${userToken}`].groups.last();
    })
    .catch((error) => console.error(error));
  // try {
  //   let data = await readData(dataPath);

  //   data[`${userToken}`].groups.push(groupInfo);

  //   writeData(dataPath, data);

  //   // TODO: verificar se o grupo foi criado
  //   return data[`${userToken}`].groups.last();
  // } catch (error) {
  //   console.error(error);
  // }
}

function getGroupById(userToken, groupId) {
  return readData(dataPath)
    .then((data) => {
      return data[`${userToken}`].groups[groupId];
    })
    .catch((error) => console.error(error));
  // try {
  //   let data = await readData(dataPath);
  //   return data[`${userToken}`].groups[groupId];
  // } catch (error) {
  //   console.error(error);
  // }
}

function updateGroup(userToken, groupId, updateInfo) {
  readData(dataPath)
    .then((data) => {
      if (!data[`${userToken}`].groups[groupId])
        throw new Error("[mem] Group not found");

      data[`${userToken}`].groups[groupId] = updateInfo;

      writeData(dataPath, data);
      return data[`${userToken}`].groups[groupId];
    })
    .catch((error) => console.error(error));
  // try {
  //   let data = await readData(dataPath);
  //   // TODO: verificar erro de undefined
  //   if (!data[`${userToken}`].groups[groupId]) throw new Error("Group not found");
  //   data[`${userToken}`].groups[groupId] = updateInfo;
  //   writeData(dataPath, data);
  //   return data[`${userToken}`].groups[groupId];
  // } catch (error) {
  //   console.error(error);
  // }
}

function deleteGroup(userToken, groupId) {
  readData(dataPath)
    .then((data) => {
      if (!data[`${userToken}`].groups[groupId])
        throw new Error("[mem] Group not found");

      data[`${userToken}`].groups.splice(groupId, 1);

      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}
// TODO: verificar o output
function listUserGroups(userToken) {
  readData(dataPath)
    .then((data) => {
      if (!data[`${userToken}`]) throw new Error("[mem] User not found");
      return data[`${userToken}`].groups;
    })
    .catch((error) => console.error(error));
}

function deleteMovie(userToken, groupId, movieId) {
  readData(dataPath)
    .then((data) => {
      if (!data[`${userToken}`].groups[groupId].movies.movieId)
        throw new Error("[mem] movie not found");

      delete data[`${userToken}`].groups[groupId].movies.movieId;

      writeData(dataPath, data);
    })
    .catch((error) => console.error(error));
}

function addMovie(userToken, groupId, mInfo) {
  readData(dataPath)
    .then((data) => {
      // verificar erros
      if (!data[`${userToken}`].groups[groupId])
        throw new Error("[mem] Group not found");

      if (!(!data[`${userToken}`].groups[groupId].movies[`${mInfo.id}`]))
        throw new Error("[mem] Movie alredy exists");
      
      data[`${userToken}`].groups[groupId].movies[`${mInfo.id}`] = mInfo;

      writeData(dataPath, data);
    }).catch((error) => console.error(error));
}

// TODO: corrigir os erros
const readData = (path) => {
  return fs
    .readFile(path)
    .then((data) => JSON.parse(data))
    .catch("[err] File not found");
};

// TODO: verificar erro e retorno do then
const writeData = (path, data) => {
  return fs
    .writeFile(path, JSON.stringify(data, null, 2))
    .then(() => console.log("[mem] Data written successfully!"))
    .catch((error) => console.log(`[err] ${error}`));
};

// Create data.json file when module is imported
const setData = () => {
  fs.writeFile(dataPath);
};
setData();

const dataMemory = {
  createUser,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
};

Array.prototype.last = () => {
  return this[this.length - 1];
};

export default dataMemory;
