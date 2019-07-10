const express=require('express');
//引入路由器模块
const userRouter=require('./routers/user');
//引入body-parser中间件
const bodyParser=require('body-parser');
var app=express();
app.listen(8081);
//使用body-parser中间件
app.use(bodyParser.urlencoded({
    extended:false //不是第三方的qs模块，而是使用querystring模块
}));
//使用路由器
app.use('/user',userRouter);
