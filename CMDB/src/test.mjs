import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

function addMovie(groupId, movieInfo) {
    return fetch(baseURL + `movies/_doc?refresh=wait_for`, {
      method: "POST",
      body: JSON.stringify({
        groupId: groupId,
        id: movieInfo.id,
        title: movieInfo.title,
        description: movieInfo.description,
        runtime: movieInfo.runtimeMins,
        year: movieInfo.year,
        image :movieInfo.image,
        directors : movieInfo.directors,
        actors : movieInfo.actors
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }).then(response => response.json())
        .then(body => body = { id: body._id, status: body.result});
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
console.log( await addMovie("222222", movieInfo ))