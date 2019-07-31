 const express = require('express');
 const query = require('../query');
 //引入crypto模块对密码加密
 var crypto = require('crypto');
 //引入连接池模块
 const pool = require('../pool');
 //创建路由器对象
 var router = express.Router();
 //引入jwt
 var jwt = require("jsonwebtoken");
 //用户注册
 router.post('/reg', function (req, res) {
     //获取post请求的数据
     var obj = req.body;
     obj.userPwd=md5(obj.userPwd);
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
    //  pool.query('insert into user set ?', [obj], function (err, result) {
    //      if (err) throw err;
    //      //判断是否插入成功
    //      if (result.affectedRows > 0) {
    //          res.send({
    //              code: 200,
    //              msg: 'reg success'
    //          });
    //      }
    //  });
 });
 //用户登录
 router.post('/login', function (req, res) {
     var obj = req.body;
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
     pool.query('select userId,email,userName,sex,birthday,signs from user where email=? and userPwd=?',[obj.email,obj.userPwd],function(err,result){
         if(err) throw err;
         var userInfo={};
         if(result.length>0){
             userInfo=result;
            let content=obj;//要生成token的主体信息
            let authToken=jwt.sign(content,"lrqnew",{
                expiresIn : 60*60*2// 授权时效2小时
            });
            res.send({code:200,msg:'login success',userInfo,token: authToken});
         }else{
            res.send({code:301,msg:'login error'});
         }
     })
 });
 //查询邮箱
 router.get('/selectMail',function(req,res){
     var obj=req.query;
     if(!obj.email){
        res.send({code:401,msg:'email required'});
        return;
     }
     pool.query('select email from user where email=?',[obj.email],function(err,result){
        if(err) throw err;
        if(result.length>0){
            res.send({code:402,msg:'email already exists'})
        }else{
            res.send({code:200,msg:'email not exists'})
        }
     });
 });
 //修改用户信息
 router.put('/updateUser',(req,res)=>{
     var obj=req.body;
     var sql=`update user SET userName=?,sex=?,birthday=?,signs=? where userId=?`;
     query(sql,[obj.userName,obj.sex,obj.birthday,obj.signs,obj.userId]).then(result=>{
          if(result.affectedRows>=1){
              res.send({code:200,msg:'update success'});
          }
     })

 })
 //导出路由器
 module.exports = router;