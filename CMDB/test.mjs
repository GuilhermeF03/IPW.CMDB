import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";
console.log( await fetch(baseURL + `movies/_search?q=groupId:"53BVsYUB3giDzGR9Mj_d"`)
.then((response) => response.json())
.then((body) => body.hits.hits)
)