import fs from "node:fs/promises"
import mem from './data-mem-revised.mjs'
const dataPath = mem.dataPath

async function clearData()
{
    await fs.writeFile(dataPath, JSON.stringify({},null,2))
}
export default
{
    clearData
}