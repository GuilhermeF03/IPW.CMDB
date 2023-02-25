import fs from "node:fs/promises";
import { errors } from "../../errors/http-errors.mjs";
import path from "path";
import url from "url";
import { read } from "node:fs";
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const dataPath = path.join(__dirname,"..\\",'..\\',"data/dataTest.json");

/* ------------------------------ [FILE] ------------------------------------------------------------------------------------------------------- */
async function readData(path) 
{
  return fs.readFile(path)
    .then((data) => JSON.parse(data))
    .catch(() => console.error("[fs] File not found at "+ path));
  //console.log("data", data);
};

async function clearData()
{
    await fs.writeFile(dataPath, JSON.stringify({},null,2))
}

function writeData(path, data) 
{
  return fs.writeFile(path, JSON.stringify(data, null, 2))
    .then(() => console.log("[fs] Data was successfully written!"))
    .catch(() => console.error("[fs] Couldn't finish writing data."));
};

Array.prototype.last = function() {return this[this.length - 1]};

Array.prototype.lastIndex = function(){return this.length - 1};

/* -------------------------------- [USER] -------------------------------------------------------------------------------------------------- */
async function isDuplicated(username) 
{
  let data = await readData(dataPath);
  let isDuplicated = false;
  for(const user in data)
    isDuplicated ||= (data[user].username == username);
  return isDuplicated
}

async function validateUser(username, password) 
{
  let data = await readData(dataPath);
  for(const user in data)
  {
    if(data[user].username == username && data[user].password == password)
      return {token: data[user].token}
  }
  return Promise.reject(errors.NOT_AUTHORIZED());
}

async function createUser(userInfo) 
{
  let data = await readData(dataPath)
  let isDup = await isDuplicated(userInfo.username)
  if(isDup)
    return Promise.reject(errors.BAD_REQUEST()) 
  data[userInfo.token] = {
    token: userInfo.token,
    username: userInfo.username,
    password:userInfo.password,
    groups: [],
  };
  return await writeData(dataPath,data)
}

/* -------------------------------- [GROUP] ------------------------------------------------------------------------------------------------- */
async function createGroup(userToken, groupInfo) 
{
    let data = await readData(dataPath)
    if(!data[userToken])
        return Promise.reject(errors.NOT_AUTHORIZED());
    groupInfo["total-duration"] = 0;
    groupInfo.movies = {};
    data[userToken].groups.push(groupInfo); 

    let group = data[userToken].groups.last();
    await writeData(dataPath, data);
    return {
      id: data[userToken].groups.lastIndex(),
      name: group.name,
      description: group.description,
    };
}

async function listUserGroups(userToken) 
{
    let data = await readData(dataPath);
    if(!data[userToken])
        return Promise.reject(errors.NOT_AUTHORIZED())
    let groups = data[userToken].groups.map( (elem,index) =>
    elem = 
    {
        id:index,
        name:elem.name,
        description:elem.description,
        "number of movies": Object.keys(elem.movies).length,
        "total-duration": elem["total-duration"],
    })
    if (!groups)
      return Promise.reject(errors.NOT_FOUND());
    return { username: data[userToken].username, groups };
}

async function getGroupById(userToken, groupId) 
{
    let data = await readData(dataPath)
    if (!data[userToken]) 
        return Promise.reject(errors.NOT_AUTHORIZED());
    if(groupId < 0)
      return Promise.reject(errors.BAD_REQUEST())
    if (groupId >= data[userToken].groups.length) 
        return Promise.reject(errors.NOT_FOUND())
    let group = data[userToken].groups[groupId]  
    if (!group)
        return Promise.reject(errors.NOT_FOUND("[Mem] The group you were trying to find does not exist."))
    return group
}

async function updateGroup(userToken, groupId, updateInfo) 
{
  let data = await readData(dataPath)
  let group = await getGroupById(userToken, groupId);
  group.name = updateInfo.name;
  group.description = updateInfo.description;
  await writeData(dataPath, data);
  delete group.movies;
  delete group["total-duration"];
  return group;

}

async function deleteGroup(userToken, groupId) 
{

  let data = await readData(dataPath)
  await getGroupById(userToken, groupId)
  data[userToken].groups.splice(groupId, 1);
  await writeData(dataPath, data);
}

/* --------------------------------- [MOVIE] ------------------------------------------------------------------------------------------------ */

async function getMovieById(userToken,groupId,movieId)
{
  let group = await getGroupById(userToken,groupId)
  return group.movies[movieId]
}

async function addMovie(userToken, groupId, mInfo) 
{
  let data = await readData(dataPath)
  let group = await getGroupById(userToken, groupId)
  let movie = group.movies[mInfo.id]
  if(movie)
    return Promise.reject(errors.BAD_REQUEST("[Mem] The movie you're trying to add was already added."));
  group.movies[mInfo.id] = mInfo;
  group["total-duration"] += parseInt(mInfo.runtime);
  data[userToken].groups[groupId] = group;
  await writeData(dataPath, data);
  return mInfo;
}

async function deleteMovie(userToken, groupId, movieId) 
{
  let data = await readData(dataPath)
  let group = await getGroupById(userToken, groupId);
  let movie = group.movies[movieId];
  if (!movie)
      return Promise.reject(errors.BAD_REQUEST());
  group["total-duration"] -= parseInt(movie.runtime);
  delete group.movies[movieId];
  await writeData(dataPath, data);
}

// checkFileExists(dataPath)
//   .then(exists => {if(!exists) writeData(dataPath, {})})
//   .catch((error) => console.error(error));

export default {
  dataPath,
  createUser,
  validateUser,
  createGroup,
  getGroupById,
  updateGroup,
  deleteGroup,
  listUserGroups,
  deleteMovie,
  addMovie,
  getMovieById
};
