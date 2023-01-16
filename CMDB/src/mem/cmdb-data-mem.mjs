import fs from "node:fs/promises";
import { errors } from "../../errors/http-errors.mjs";
import path from "path";
import url from "url";
import { read } from "node:fs";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.join(__dirname,"..\\","..\\","data/data.json");

/* ------------------------------ [FILE] ------------------------------------------------------------------------------------------------------- */
/*function checkFileExists(file) {
  return fs
    .access(file, fs.constants.F_OK)
    .then(() => true)
    .catch((error) => console.log(error))
    .catch(() => false)
    
}*/

function readData(path) {
  return fs.readFile(path)
    .then((data) => JSON.parse(data))
    .catch(() => console.error("[fs] File not found at "+ path));
  //console.log("data", data);
};

function writeData(path, data) {
  return fs.writeFile(path, JSON.stringify(data, null, 2))
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
      username: userInfo.username,
      password:userInfo.password,
      groups: [],
    };
    isDuplicated(userInfo.username)
    .then( result => {
        if(!result)
          return Promise.resolve(writeData(dataPath, data));
        else return -1;
      }
    )
  });
}
function isDuplicated(username) {
  return readData(dataPath)
         .then(data =>{
          for(const user in data){
            if(data[user].username == username)
              return true;
          }
          return false;
        })
}

function validateUser(username, password) {
  // validate user credentials for login
  return readData(dataPath)
         .then((data) =>{
          for(const key in data){
            if(data[key].username == username && data[key].password == password)
              return Promise.resolve(data[key]);
          }
          return Promise.reject()
         })
}

function validateUser(username, password) {
  return readData(dataPath).then((data) => {
    Object.getOwnPropertyNames(data).forEach(key => {
      if(data[key].username == username && data[key].password == password) {return {token: data[key].token}};
    });
    return Promise.reject(errors.NOT_AUTHORIZED());
  })
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
      (elem, index) =>
        (elem = {
          id:index, 
          name: elem.name,
          description: elem.description,
          "number of movies": Object.keys(elem.movies).length,
          "total-duration": elem["total-duration"],
        })
    );

    if (!groups) throw new Error("[Mem] No groups found");
  
    console.log(groups)
    return { username: data[userToken].username, groups };

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
    .catch(console.log)
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
    data[userToken].groups[groupId] = group;

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

// checkFileExists(dataPath)
//   .then(exists => {if(!exists) writeData(dataPath, {})})
//   .catch((error) => console.error(error));

export default {
  validateUser,
  createUser,
  validateUser,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
};
