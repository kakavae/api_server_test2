# api_server_test2
Api server completed by nodeJs
1. 这是我学完基本的Node.js之后搭建的一个简单的后台服务器
2. 功能：（1）发表文章；（2）获取文章列表；（3）登录和使用token获取个人信息
### app.js是主文件，负责开启服务器，中间挂载负责注册登录，上传文件的路由

### db文件内保存了操作数据库的模块，其中index.js向外暴露了数据库的操作对象

### router内的文件保存了登录注册，修改信息，管理文件的路由模块

#### router_header保存了路由处理函数模块，向外暴露之后被router内的路由引用

### schema内保存了验证前端传输过来的数据是否正确的验证规则，验证规则在调用接口之后执行，也就是在router当中，调用路由处理函数之前
