// 导入express模块
const express = require('express');
// 初始化路由对象
const router = express.Router();

// 导入表单数据验证的中间件
const expressJoi = require('@escook/express-joi');

// 导入定义的验证规则模块
const { updata_userinfo_schema, update_password_schema, update_avatar_schema } = require('../schema/user');

// 导入路由处理函数模块
const userinfo_header = require('../router_header/userinfo');

// 为路由对象挂载获取用户信息的路由
router.get('/userinfo', userinfo_header.getUserInfo);
// 为路由对象挂载更新用户信息的路由
router.post('/userinfo', expressJoi(updata_userinfo_schema), userinfo_header.updateUserinfo);
// 为路由对象挂载修改密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_header.updatePassword);
// 为对象挂载更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_header.updateAvatar);

// 将路由对象暴露出去
module.exports = router;