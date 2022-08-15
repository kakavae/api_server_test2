// 导入数据库操作模块
const db = require('../db/index');

// 导入比较密码的模块
const bcrypt = require('bcryptjs')

// 定义查询用户信息的sql语句
// 注意：为了防止用户的密码泄露，需要排除 password 字段
const sql = 'select username, nikename, email, user_pic from ev_users where id = ?'

// 定义获取用户信息的函数并暴露
module.exports.getUserInfo = (req, res) => {
    // 调用db.query执行sql语句
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('获取用户信息失败');
        res.send({
            status: 0,
            message: '获取用户信息成功',
            data: results[0],
        })
    })
}

// 定义更新用户信息的函数并暴露
module.exports.updateUserinfo = (req, res) => {
    // 1.定义更新用户基本信息的sql语句
    const sql = 'update ev_users set ? where id = ?';
    // 2.调用db.query执行sql语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err);
        // 执行sql语句成功，但是影响行数不为1
        if (results.affectedRows !== 1) return res.cc('更新用户信息失败');
        res.cc('更新用户信息成功', 0);
    })
}

// 定义修改密码的路由并向外暴露
module.exports.updatePassword = (req, res) => {
    // 1.定义查询用户是否存在的sql语句
    const sql = 'select * from ev_users where id = ?';
    // 2.执行查询用户是否存在的sql语句
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err);
        if (results.length !== 1) return res.cc('用户信息查询失败');

        // 比较密码是否和数据库当中的密码一致
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password);
        if (!compareResult) return res.cc('旧密码错误');

        // 定义更新密码的sql语句
        const sql = 'update ev_users set password = ? where id = ?';
        // 加密用户输入的新密码
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
        // 执行更新密码的sql语句
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err);
            // SQL 语句执行成功，但是影响行数不等于 1
            if (results.affectedRows !== 1) return res.cc('修改密码失败');
            res.cc('修改密码成功', 0);
        })
    })
}

// 定义更新用户头像的路由并向外暴露
module.exports.updateAvatar = (req, res) => {
    // 定义更新头像的sql语句
    const sql = 'update ev_users set user_pic = ? where id = ?';
    // 执行sql语句
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // sql语句执行失败
        if (err) return res.cc(err);
        // 影响行数不为1
        if (results.affectedRows !== 1) return res.cc('更换用户头像失败');
        res.cc('更换用户头像成功', 0);
    })
}