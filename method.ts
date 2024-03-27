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