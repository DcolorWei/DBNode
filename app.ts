import { DbStruct } from "./dbStruct";

const db = new DbStruct();
db.loadData().then(() => {
    db.query("admin", [])
})