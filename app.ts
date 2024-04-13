import { TSDB } from "./dbStruct";

const db = new TSDB();
import { DbStruct } from "./dbStruct";

const db = new DbStruct();
db.loadData().then(() => {
    db.query("admin", [])
})