const fs = require('fs');
const path = require('path');

const recordsPath = path.join(__dirname, 'records');

// 处理records文件夹下的csv文件
// 每一个换行符要是后面不跟着双引号，就替换为'\n'
function handleCSVFile(filePath) {
    const content
        = fs.readFileSync(filePath,
            {
                encoding: 'utf8'
            });
    const newContent = content.replace(/\n(?!\")/g, '\\n');
    fs.writeFileSync(filePath, newContent);
}

// 读取records文件夹下的所有文件
function readRecords() {
    const files = fs.readdirSync(recordsPath);
    files.forEach(file => {
        const filePath = path.join(recordsPath, file);
        handleCSVFile(filePath);
    });
}

readRecords();