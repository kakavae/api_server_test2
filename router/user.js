// 导入express模块
const express = require('express');

// 1.导入表单数据验证的中间件
const expressJoi = require('@escook/express-joi');

// 2.导入需要的验证规则对象
// 使用局部结构赋值的方式，表示只得到对象当中名字为指定值的一个属性或者方法
const { reg_login_schema } = require('../schema/user');

// 创建router路由对象
const router = express();

// 为router绑定多个路由

// 将注册路由的时候的回调函数抽出，放在单独的js文件中
const userHandler = require('../router_header/user')

// 注册路由
// 3. 在注册新用户的路由中，声明局部中间件，对当前请求中携带的数据进行验证
// 3.1 数据验证通过后，会把这次请求流转给后面的路由处理函数
// 3.2 数据验证失败后，终止后续代码的执行，并抛出一个全局的 Error 错误，进入全局错误级别中间件中进行处理
router.post('/reguser', expressJoi(reg_login_schema), userHandler.regUser)

// 登录路由
router.post('/login', expressJoi(reg_login_schema), userHandler.login)

// 通过module.exports将路由对象暴露出去
module.exports = router;