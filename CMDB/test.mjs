import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";
  console.log(await fetch(baseURL + `groups/_delete_by_query?q=userId:ADMIN`,{
    method:"POST"
  })
  .then(resp => resp.json())
  //.then(body => console.log(body))
  )
