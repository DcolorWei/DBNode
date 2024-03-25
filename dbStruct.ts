import { FieldType, NumStrBool } from "./dbType";
import fs from 'fs';
import { checkSystemConfig, getAllRecords } from "./method";

export class FieldStruct {
    fieldname: string;
    type: FieldType;
    inuse: boolean;

    constructor(fieldid: number, fieldname: string, type: FieldType, inuse: boolean) {
        this.fieldname = fieldname;
        this.type = type;
        this.inuse = inuse;
    }
}

export class TableStruct {
    tablename: string;
    fields: Array<FieldStruct>;
    records: Array<NumStrBool[]>;

    constructor(tableid: number, tablename: string, fields: Array<FieldStruct>, records: Array<NumStrBool[]>) {
        this.tablename = tablename;
        this.fields = fields;
        this.records = records;
    }
}

export class DbStruct {
    data: Array<TableStruct>;

    constructor() {
        this.data = [];
    }

}
