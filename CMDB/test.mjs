import fetch from "node-fetch";

const baseURL = "http://localhost:9200/";

function createUser(userInfo) {
    return fetch(baseURL + `users/_doc?refresh=wait_for`, {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json());
  }
  
  function validateUser(username, ) {
    return fetch(baseURL + `users/_search?q=username:${username}`)
    .then(resp => resp.json())
    .then(res => res.hits.hits.map(hits => hits._source).length == 0)
    // .then(user => {return (user.password == password)? {token:user.token} : Promise.reject()})
}
  
let user = { token: "ADMIN2", username: "admin2", password: "admin" };

// await createUser(user)

console.log(await validateUser("adalberto"));