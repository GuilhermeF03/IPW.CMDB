import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";


function deleteGroup(groupId) {
  return fetch(baseURL + `groups/_doc/${groupId}`, { method: "DELETE" })
    .then((response) => response.json())
    .then(result => result = {status: result.result, groupId: groupId})
    .then(removeGroupMovies(groupId));
    
}

function removeGroupMovies(groupId) {
  return fetch(baseURL + `movies/_delete_by_query?q=groupId:"${groupId}"`, {
    method: "POST",
  }).then((response) => response.json());
}
   
let userToken = "276381264wgdgw72361-1";
let movieInfo = {
    id: "21634174",
    title: "bananas",
    description: "bananas fazem bem à saúde",
    runtimeMins: 450,
    year: "1900",
    image : "bananas",
    directors : "macaco",
    actors : "gorilas"
}

let updateInfo = {userToken: userToken, name: "bananas", description: "bananas fazem bem à saúde"} 
console.log(await deleteGroup("lUEMYIUBC0x3lnHVgaWF"))