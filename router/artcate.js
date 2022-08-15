// 获取文章分类列表的路由模块

// 导入express模块
const express = require('express');

// 创建路由对象
const router = express();

// 导入路由处理函数模块
const artcate_handle = require('../router_header/artcate');

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入定义的验证规则模块
const { add_cates_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate');

// 为路由对象挂载路由实例
// 获取文章分类列表数据的路由
router.get('/cates', artcate_handle.getArticleCates);

// 新增文章分类的路由
router.post('/addcates', expressJoi(add_cates_schema), artcate_handle.addArticleCates);

// 根据id删除文章列表的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handle.deleteCateById);

// 根据id获取文章分类数据的路由
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handle.getArtCateById);

// 根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handle.updateCateById);

// 将路由对象暴露出去
module.exports = router;