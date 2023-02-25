import fetch from "node-fetch";
const baseURL = "http://localhost:9200/";
import path from "path";
async function getAllEntries(index)
{
  const __searchPath = (index) => path.join(baseURL,index,'_search' )
  const response = await fetch(__searchPath(index), 
  {
      method: 'GET'
  });
  const json = await response.json();
  return json.hits.hits
}

  //check if username already exists
async function deleteAllEntries(index) 
{
    const __deletePath = (index) => path.join(baseURL,index,'_delete_by_query')
    const response = await fetch(__deletePath(index), 
    {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
        {
            "query": 
            {
                "match_all": {}
            }
        })
    });
    const json = await response.json();
    return json;
}
//     const a = "api/movie/DHAIJKDAJHL"
// const paths = ['signup', 'search', 'popular', 'movie']
//   console.log(paths.includes(a.split('/')[1])) 
export default {getAllEntries, deleteAllEntries}