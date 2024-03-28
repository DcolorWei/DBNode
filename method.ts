import fs from 'fs';
import readline from 'readline';
import { FieldStruct, TableStruct } from './dbStruct';
import { NumStrBool } from './dbType';

export function checkSystemConfig(data: Array<Pick<TableStruct, 'tablename' | 'fields'>>): boolean {
    for (const item of data) {
        const filePath = `./records/${item.tablename}.csv`;
        if (!fs.existsSync(filePath)) {
            throw new Error(`Expect Table ${item.tablename} does not exist in records fold.`);
        }
        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });

        rl.once('line', (line) => {
            // 处理第一行数据
            const fileHeader = line.split(',').map(field => field.replace(/"/g, ''));
            const fields = item.fields.map(field => field.fieldname);

            fields.forEach((field, index) => {
                if (field !== fileHeader[index]) {
                    throw new Error(`Expect Filed ${field} does not exist in csv ${item.tablename}.`);
                }
            });
        })
    }
    return true;
}

export function getAllRecords(tablename: string): Promise<Array<NumStrBool[]>> {
    return new Promise((resolve, reject) => {
        const filePath = `./records/${tablename}.csv`;
        const data = fs.readFileSync(filePath, 'utf-8').split('\r\n').map(line => line.split(','));
        data.forEach((record, index) => {
            data[index].forEach((_, t) => {
                data[index][t] = data[index][t].replace(/^"/, '').replace(/"$/, '');
            });
        });
        resolve(data);
    });
}

// 使用系统配置的字段和csv数据生成对象
export type RecordKeyValue = { key: string, value: NumStrBool }
export function transCsv2KeyValue(record: NumStrBool[], fields: FieldStruct[]): Array<RecordKeyValue> {
    const result: Array<RecordKeyValue> = []
    if (record.length !== fields.length) throw new Error('record length not match fields length');
    fields.forEach((field, index) => {
        if (field.inuse) {
            switch (field.type) {
                case 'number':
                    record[index] = Number(record[index]);
                    break;
                case 'string':
                    break;
                case 'boolean':
                    record[index] = record[index] === 'true';
                    break;
                default:
                    throw new Error('field type not supported');
            }
            result.push({ key: field.fieldname, value: record[index] })
        }
    })
    return result;
}