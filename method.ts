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
    console.log('getAllRecords', tablename);
    return new Promise((resolve, reject) => {
        const filePath = `./records/${tablename}.csv`;
        const data = fs.readFileSync(filePath, 'utf-8').split('\n').map(line => line.split(','));
        resolve(data);
    });
}

// 使用系统配置的字段和csv数据生成对象
export function csvrecord2object(record: NumStrBool[], fields: FieldStruct[]): Record<string, NumStrBool> {
    const result: Record<string, NumStrBool> = {};
    if (record.length !== fields.length) throw new Error('record length not match fields length');
    fields.filter(field => field.inuse).forEach((field, index) => result[field.fieldname] = record[index]);
    return result;
}