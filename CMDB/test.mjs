import fetch from "node-fetch";



fetch('http://localhost:9200/users', {
  method: 'DELETE'
})
  .then(response => console.log(response))
  .catch(error => console.error(error));
