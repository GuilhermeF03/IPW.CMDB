// // Get data from elastic/memory

// // Create
// // Read
// // Update
// // Delete

// // function create(){}
// // function read(){}
// // function update(){}
// // function delete(){}

// export const mem = {}
import fs from "node:fs/promises";

const dataPath = "../data/data.json";

function createUser(userInfo) {
  let data = readData(dataPath);
  data[`${userInfo.token}`] = { name: userInfo.name, groups: [] };
  writeData(dataPath, data);
}

function createGroup(userToken, groupInfo) {
  fs.readData(dataPath)
    .then((data) => {
      JSON.parse(data);
      data[`${userToken.token}`] = { groups: groupInfo };
      fs.writeFile(dataPath, JSON.stringify(data));
    })
    .catch(error);
}

function getGroupById(userToken, groupId) {}

function updateGroup(userToken, groupId, updateInfo) {}

function deleteGroup(userToken, groupId) {}

function listUserGroups(userToken) {}

function deleteMovie(userToken, groupId, movieId) {}

function addMovie(userToken, groupId, movieId) {}

const readData = (path) => {
  return fs
    .readFile(path)
    .then((data) => JSON.parse(data))
    .catch("File not found");
};

// TODO: verificar erro
const writeData = (path, data) => {
  fs.writeFile(path, JSON.stringify(obj, null, 2))
    .then(() => console.log("File written"))
    .catch((error) => console.log(error));
};

// const setData = () => {fs.writeFile(dataPath)}

// setData()

const dataMem = {
  createUser,
};

export default dataMem;
