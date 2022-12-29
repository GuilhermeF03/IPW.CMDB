import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";


function listUserGroups(userToken) {
    return fetch(baseURL + `groups/_search?q=userToken:"${userToken}"`, {
        headers: { "Accept": "application/json" },
    })
        .then(response => response.json())
        .then(body => body.hits.hits.map(t => t._source))
}
  
function createGroup(userToken, groupInfo) {
    return fetch(baseURL + `groups/_doc?refresh=wait_for`, {
        method: "POST",
        body: JSON.stringify({
        userToken: userToken,
        name: groupInfo.name,
        description: groupInfo.description,
        }),
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        },
    }).then((response) => response.json())
        //TODO: CHECK
        .then(result => { return groupInfo })
}
  
let groupInfo = { name: "Filmes de verão", description: "Filmes de verão para serem vistos num inverno frio e chuvoso" };
let userToken = "276381264wgdgw72361-1";
console.log( await createGroup(userToken, groupInfo))