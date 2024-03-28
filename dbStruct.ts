import { FieldType, NumStrBool } from "./dbType";
import fs from 'fs';
import { checkSystemConfig, getAllRecords, RecordKeyValue, transCsv2KeyValue } from "./method";

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
        this.loadData();
    }

    private async loadData() {
        console.log('loadData');
        const data = JSON.parse(fs.readFileSync('system.json', 'utf-8'))
        if (!data) return;
        if (!checkSystemConfig(data)) return;
        await Promise.all(data.map(async (item: TableStruct) => {
            item.records = await getAllRecords(item.tablename);
        }));
        this.data = data;
    }

    getTables() {
        return this.data.map(({ tablename, fields }) => ({ tablename, fields }));
    }

    query(tablename: string, query: Array<Record<string, NumStrBool>>): Array<RecordKeyValue[]> {
        const table = this.data.find(table => table.tablename === tablename);
        if (!table) {
            return [];
        }
        const result: Array<NumStrBool[]> = [];
        table.records.forEach((record: NumStrBool[]) => {
            let isMatch = true;
            query.forEach(({ fieldname, value }) => {
                const fieldIndex = table.fields.findIndex(field => field.fieldname === fieldname);
                if (fieldIndex === -1) {
                    isMatch = false;
                    return;
                }
                if (record[fieldIndex] !== value) {
                    isMatch = false;
                    return;
                }
            });
            if (isMatch) {
                result.push(record);
            }
        });
        return result.map(record => transCsv2KeyValue(record, table.fields));
    }
}
