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
 var multiparty = require('multiparty');
 var fs = require("fs");
 //用户注册
 router.post('/reg', function (req, res) {
     //获取post请求的数据
     var obj = req.body;
     obj.regTime = new Date().toLocaleDateString();
     var pwd = obj.userPwd;
     var md5 = crypto.createHash('md5');
     obj.userPwd = md5.update(pwd).digest('hex');
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
     pool.query('insert into user set ?', [obj], function (err, result) {
         if (err) throw err;
         //判断是否插入成功
         if (result.affectedRows > 0) {
             res.send({
                 code: 200,
                 msg: 'reg success'
             });
         }
     });
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
     var pwd = obj.userPwd;
     var md5 = crypto.createHash('md5');
     obj.userPwd = md5.update(pwd).digest('hex');
     pool.query('select userId,email,userName,sex,birthday,signs,regTime,avatar from user where email=? and userPwd=?', [obj.email, obj.userPwd], function (err, result) {
         if (err) throw err;
         var userInfo = {};
         if (result.length > 0) {
             userInfo = result;
             let content = obj; //要生成token的主体信息
             let authToken = jwt.sign(content, "lrqnew", {
                 expiresIn: 60 * 60 * 2 // 授权时效2小时
             });
             res.send({
                 code: 200,
                 msg: 'login success',
                 userInfo,
                 token: authToken
             });
         } else {
             res.send({
                 code: 301,
                 msg: 'login error'
             });
         }
     })
 });
 //查询邮箱
 router.get('/selectMail', function (req, res) {
     var obj = req.query;
     if (!obj.email) {
         res.send({
             code: 401,
             msg: 'email required'
         });
         return;
     }
     pool.query('select email from user where email=?', [obj.email], function (err, result) {
         if (err) throw err;
         if (result.length > 0) {
             res.send({
                 code: 402,
                 msg: 'email already exists'
             })
         } else {
             res.send({
                 code: 200,
                 msg: 'email not exists'
             })
         }
     });
 });
 //修改用户信息
 router.put('/updateUser', (req, res) => {
     var obj = req.body;
     var sql = `update user SET userName=?,sex=?,birthday=?,signs=? where userId=?`;
     query(sql, [obj.userName, obj.sex, obj.birthday, obj.signs, obj.userId]).then(result => {
         if (result.affectedRows >= 1) {
             res.send({
                 code: 200,
                 msg: 'update success'
             });
         }
     })
 });
 //修改密码
 router.put('/updatePwd', (req, res) => {
     var obj = req.body;
     var md5 = crypto.createHash('md5');
     var oldPassword = md5.update(obj.oldPassword).digest('hex');
     var sql = `select userId from user where userPwd=? and userId=?`;
     query(sql, [oldPassword, obj.userId]).then(result => {
         if (result.length > 0) {
             var sql = `update user set userPwd=? where userId=?`;
             var md5 = crypto.createHash('md5');
             var newPassword = md5.update(obj.userPwd).digest('hex');
             return query(sql, [newPassword, obj.userId]).then(result => {
                 if (result.affectedRows > 0) {
                     res.send({
                         code: 200,
                         msg: 'updatePwd success'
                     });
                 } else {
                     res.send({
                         code: 401,
                         msg: 'updatePwd error'
                     });
                 }
             });
         } else {
             res.send({
                 code: '402',
                 msg: 'passworld error'
             });
         }
     })

 });
 //上传头像
 router.post('/avatar', (req, res) => {
     var form = new multiparty.Form();
     form.uploadDir = "./public/images";
     form.parse(req, function (err, fields, files) {
         let userId=fields.userId[0];
         if (err) {
             throw err;
         } else {
             //新图片名
            //  let avatar=userId+'.'+files.file[0].originalFilename.split('.')[1];
            let avatar=files.file[0].originalFilename;
             //同步重命名文件名
             fs.renameSync(files.file[0].path, "./public/images/" + files.file[0].originalFilename);
             var sql=`update user set avatar=? where userId=?`;
             query(sql,[avatar,userId]).then(result=>{
                if (result.affectedRows > 0) {
                    res.send({
                        code: 200,
                        avatar:avatar,
                        msg: 'updateAvatar success'
                    });
                } else {
                    res.send({
                        code: 401,
                        msg: 'updateAvatar error'
                    });
                }
             });
           
         }
     })
 })
 //导出路由器
 module.exports = router;