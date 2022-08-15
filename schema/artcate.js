// 文章数据验证模块

// 导入定义验证规则的模块
const joi = require('joi');

// 定义新增文章列表数据的验证规则
const name = joi.string().required();
const alias = joi.string().alphanum().required();

// 定义id的校验规则
const id = joi.number().integer().min(1).required();

// 将定义的验证规则暴露出去
module.exports.add_cates_schema = {
    body: {
        name,
        alias,
    }
}

// 验证规则对象-删除分类
module.exports.delete_cate_schema = {
    params: {
        id,
    }
}

// 验证规则对象-根据id获取文章分类
module.exports.get_cate_schema = {
    params: {
        id,
    }
}

// 验证规则对象-根据id更新文章分类
module.exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias,
    }
}