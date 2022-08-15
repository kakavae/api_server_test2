// 导入数据库操作模块
const db = require('../db/index');

// 定义sql语句
// 验证用户名是否重复
const sql = 'select * from ev_users where username = ?';
// 注册新用户插入到数据库当中
const sql_insert = 'insert into ev_users set ?';

// 导入密码加密需要用到的模块
const bcrypt = require('bcryptjs');

// 导入生成token字符串的包
const jwt = require('jsonwebtoken');

// 导入配置好的token密钥和有效期的模块
const config = require('../config');

module.exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的数据
    const userinfo = req.body;
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({ status: 1, message: '用户名和密码不能为空' })
    //     return res.cc('用户名和密码不能为空')
    // }
    // 执行sql语句并根据执行的结果返回值，判断用户名是否重复
    db.query(sql, [userinfo.username], (err, result) => {
        if (err) {
            // return res.send({ status: 1, message: err.message })
            return res.cc(err)
        }
        if (result.length > 0) {
            // return res.send({ status: 1, message: '用户名被占用，请重新输入用户名' })
            return res.cc('用户名被占用，请重新输入用户名')
        }
        // 用户名成功，密码加密
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.password = bcrypt.hashSync(userinfo.password, 10);

        // 执行插入用户的sql语句
        db.query(sql_insert, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                // return res.send({ status: 1, message: err.message })
                return res.cc(err)
            }
            if (results.affectedRows !== 1) {
                // return res.send({ status: 1, message: '注册用户失败，请稍后重试' })
                return res.cc('注册用户失败，请稍后重试')
            }
            // res.send({ status: 0, message: '注册用户成功' });
            res.cc('注册用户成功', 0);
        })
    })
}
module.exports.login = (req, res) => {
    // 1.获取用户传输过来的数据
    const userinfo = req.body;
    // 2.定义查询用户名的sql语句
    const sql = 'select * from ev_users where username = ?';
    // 3.执行sql语句并判断用户名是否有，有的话就执行密码验证
    db.query(sql, userinfo.username, (err, result) => {
        if (err) return res.cc(err);
        if (result.length !== 1) return res.cc('登录失败')
        // 用户密码验证
        // 调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
        const compareResult = bcrypt.compareSync(userinfo.password, result[0].password);
        if (!compareResult) {
            return res.cc('用户密码错误')
        }
        // 1. 剔除客户端传输过来的数据中的密码和头像信息
        const user = { ...result[0], password: '', user_pic: '' }
        // 2. 使用jwt的sign方法生成token字符串
        const token = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn });
        // 3. 将生成的token字符串发送给客户端，拼接上Bearer
        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + token
        })
    })
}