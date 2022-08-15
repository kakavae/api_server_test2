// 发表文章的路由模块

// 导入express模块
const { application } = require('express');
const express = require('express');

// 创建路由对象
const router = express();

// 导入路由处理函数模块
const article_handler = require('../router_header/article');

// 为路由对象挂载发表文章的路由
router.post('/add', article_handler.addArticles);

// 暴露这个路由对象
module.exports = router;