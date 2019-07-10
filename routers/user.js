 const express = require('express');
 //引入连接池模块
 const pool = require('../pool');
 //创建路由器对象
 var router = express.Router();
 //用户注册
 router.post('/reg', function (req, res) {
     //获取post请求的数据
     var obj = req.body;
     //验证每一项数据是否为空
     if (!obj.email) {
         res.send({
             code: 401,
             msg: 'email require'
         });
         return;
     }
     if (!obj.userPwd) {
         res.send({
             code: 402,
             msg: 'userPwd required'
         });
         return;
     }
     //执行sql语句
     pool.query('insert into user set ?',[obj],function(err,result){
         if (err) throw err;
         //判断是否插入成功
         if(result.affectedRows>0){
            res.send({code:200,msg:'reg success'});
         }
     });
 });
 //导出路由器
module.exports=router;