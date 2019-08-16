const express = require('express');
//引入路由器模块 
const userRouter = require('./routers/user');
const diaryRouter=require('./routers/diary');
const adviceRouter=require('./routers/advice');
//引入body-parser中间件
const bodyParser = require('body-parser');
//引入跨域插件
var cors = require('cors');
//引入jwt
var expressJwt = require("express-jwt");
var app = express();
app.listen(3000);
//托管静态资源到public目录下
app.use(express.static('public'));
//使用body-parser中间件
app.use(bodyParser.urlencoded({
  extended: false //不是第三方的qs模块，而是使用querystring模块
}));
app.use(bodyParser.json())
//设置跨域
app.use(cors({
  origin: ['http://localhost:8080'],
  methods: ['GET', 'POST','DELETE','PUT'],
  // credentials:true,
  alloweHeaders: ['Content-Type', 'Authorization']
}));
// jwt中间件
app.use(expressJwt({
    secret: "lrqnew",  //加密密钥，可换
  }).unless({
    path: ["/api/user/login","/api/user/reg","/api/user/selectMail"] //添加不需要token的接口
  })
);

// 未携带token请求接口会出错，触发这个
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // res.status(401).send({msg:'登录过期,请重新登录'});
    res.status(200).send({code:408,msg:'登录过期,请重新登录'});
  } 
});
//使用路由器
app.use('/api/user', userRouter);
app.use('/api/diary', diaryRouter);
app.use('/api/advice',adviceRouter);