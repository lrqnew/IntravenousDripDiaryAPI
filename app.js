const express = require('express');
//引入路由器模块
const userRouter = require('./routers/user');
//引入body-parser中间件
const bodyParser = require('body-parser');
//引入跨域插件
var cors = require('cors');
//引入jwt
 var expressJwt = require("express-jwt");

var app = express();
app.listen(8081);
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
  methods: ['GET', 'POST'],
   alloweHeaders: ['Conten-Type', 'Authorization']
}));

// jwt中间件
app.use(expressJwt({
    secret: "lrqnew" //加密密钥，可换
  })
  .unless({
    path: ["/user/login","/user/reg"] //添加不需要token的接口
  })
);

// 未携带token请求接口会出错，触发这个
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send(err);
  }
  console.log(req.body)
  var token = req.body.token;
  console.log(token);
    // //用 加密密钥 解密，获得信息，包括生成及失效日期（如果设置了失效时间）
    // jwt.verify(token, "secret", function(err, decoded) {
    //     if (err) {
    //         res.status(200).json(err)
    //     } else {
    //         res.status(200).json(decoded);
    //     }
    // })
});


//使用路由器
app.use('/user', userRouter);