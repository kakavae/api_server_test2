// 导入express模块
const express = require('express');

// 导入定义验证规则的包
const joi = require('joi');

// 导入解析token字符串的包
const expressJWT = require('express-jwt');

// 导入token相关的配置文件
const config = require('./config');

// 创建web服务器的实例
const app = express();

// 配置cors跨域
// 导入cors模块
const cors = require('cors');
// 将cors注册为全局可用的中间件
app.use(cors());

// 配置解析表单数据的中间件
// 解析表单上传的application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));

// 响应数据的中间件，为res对象挂载一个res.cc()函数
app.use(function (req, res, next) {
    // status=0为成功,status=1为失败；默认将status的值设置为1，方便处理失败的情况
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next();
})

// 在注册路由之前，配置解析token的全局中间件,指定哪些接口不需要token认证
// 解析后的数据会保存在req.user当中
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// 导入router路由模块
const userRouter = require('./router/user');
// 将路由注册为全局可用的中间件
app.use('/api', userRouter);

// 导入修改用户信息的路由模块
const userinfoRouter = require('./router/userinfo');
// 将路由注册为全局可用的中间件
app.use('/my', userinfoRouter);

// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter);

// 导入并使用发表文章的路由模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter);

// 注册全局可用的错误级别的中间件
app.use((err, req, res, next) => {
    // 验证规则出错
    if (err instanceof joi.ValidationError) {
        return res.cc(err)
    }
    // token认证失败后的错误
    if (err.name = 'UnauthorizedError') {
        res.cc('身份认证失败')
    }
    // 未知错误
    res.cc(err);
    next();
})

// 调用app.listen方法启动服务器
app.listen(8091, () => {
    console.log('visit web server at http://127.0.0.1:8091')
})