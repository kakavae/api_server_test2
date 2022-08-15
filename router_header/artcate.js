// 路由处理函数模块

// 导入数据库处理模块
const db = require('../db/index');

// 定义获取文章分类列表数据的路由处理函数
module.exports.getArticleCates = (req, res) => {
    // 定义获取文章列表数据的sql语句
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc';
    // 执行获取文章列表数据的sql语句
    db.query(sql, (err, results) => {
        if (err) return res.cc(err);
        res.send({
            status: 0,
            message: '获取文章列表数据成功',
            data: results,
        })
    })
}

// 定义新增文章分类列表数据的处理函数
module.exports.addArticleCates = (req, res) => {
    // 1.定义查重的sql语句
    const sql = 'select * from ev_article_cate where name = ? or alias = ?';
    // 2.执行分类名和分类别名是否被占用的sql语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 3.sql语句执行失败
        if (err) return res.cc(err);
        // 4.1 results.length=2的情况
        if (results.length === 2) return res.cc('分类名和分类别名被占用');
        // 4.2 results.length = 1的三种情况
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名和分类别名被占用');
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名被占用');
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用');
        }

        // 定义插入文章分类的sql语句
        const sql = 'insert into ev_article_cate set ?';
        // 执行插入文章分类的sql语句
        db.query(sql, req.body, (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err);
            // 影响行数不为1
            if (results.affectedRows !== 1) return res.cc('插入文章分类信息失败');
            res.cc('插入文章分类列表数据成功', 0);
        })
    })
}

// 定义根据id删除文章分类列表的处理函数
module.exports.deleteCateById = (req, res) => {
    //定义删除文章分类的标记删除sql语句
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    // 使用db.query执行标记删除sql语句
    db.query(sql, req.params.id, (err, results) => {
        // sql语句执行失败
        if (err) return res.cc(err);
        // sql语句执行成功，但是影响行数不是1
        if (results.affectedRows !== 1) return res.cc('删除文章分类失败');
        res.cc('删除文章分类成功', 0);
    })
}

// 定义根据id获取文章分类数据的路由处理函数
module.exports.getArtCateById = (req, res) => {
    // 1.定义根据Id获取文章分类的sql语句
    const sql = 'select * from ev_article_cate where id = ?';
    // 2.调用db.query执行sql语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行sql语句失败
        if (err) return res.cc(err);
        // 执行sql语句成功，但是没有查询到数据
        if (results.length !== 1) return res.cc('获取文章分类失败');
        // 获取文章分类数据成功
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0],
        })
    })
}

// 定义根据id更新文章分类的路由处理函数
module.exports.updateCateById = (req, res) => {
    // 定义查重的sql语句 排除了当前输入的id的这一行数据
    const sql = 'select * from ev_article_cate where id<>? and ( name = ? or alias = ? )';
    // 执行sql语句
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // sql语句执行失败
        if (err) return res.cc(err);
        // 根据results的不同结果判断名称还是别名被占用
        if (results.length === 2) return res.cc('分类名称和别名都被占用');
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) {
            return res.cc('分类名称和别名都被占用');
        }
        if (results.length === 1 && results[0].name === req.body.name) {
            return res.cc('分类名称被占用');
        }
        if (results.length === 1 && results[0].alias === req.body.alias) {
            return res.cc('分类别名被占用');
        }

        // 定义更新文章分类的sql语句
        const sql = 'update ev_article_cate set ? where id = ?';
        // 执行更新文章分类的sql语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            // 执行sql语句失败
            if (err) return res.cc(err);
            // 执行sql语句成功,但是影响行数不为1
            if (results.affectedRows !== 1) return res.cc('更新文章分类数据失败');
            res.cc('更新文章分类数据成功', 0);
        })
    })
}
