// import mem from "./mem/cmdb-data-mem.mjs";
import mem from "./mem/cmdb-data-elastic.mjs";

const userToken = "276381264wgdgw72361-1";

await mem.createUser({ token: userToken, name: "Eusébio" })