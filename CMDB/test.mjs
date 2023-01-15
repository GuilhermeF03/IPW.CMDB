import fetch from "node-fetch";
const baseURL = "http://localhost:9200/";

// async function getAllEntries() {
//   const response = await fetch('http://localhost:9200/users/_search', {
//       method: 'GET'
//   });
//   const json = await response.json();
//   return json.hits.hits;
// }

// getAllEntries().then(console.log);
  // check if username already exists
  async function deleteAllEntries() {
    const response = await fetch('http://localhost:9200/users/_delete_by_query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "query": {
                "match_all": {}
            }
        })
    });
    const json = await response.json();
    return json;
}

deleteAllEntries().then(console.log)
    


