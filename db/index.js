// 在项目根目录中新建 /db/index.js 文件，在此自定义模块中创建数据库的连接对象：
const mysql = require('mysql');

// 创建数据库连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01'
})

// 向外共享数据库连接对象
module.exports = db;