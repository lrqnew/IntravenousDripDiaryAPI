const express = require('express');
//引入连接池模块
const pool = require('../pool');
//创建路由器对象
var router = express.Router();
//写日记
router.post('/pushAdvice', function (req, res) {
    //获取post请求的数据
    var obj = req.body;
    obj.adTime = new Date().toLocaleDateString();
    if(!obj.adContent){
        res.send({code:401,msg:'adContent required'});
        return;
    }
    //执行sql语句
    pool.query('insert into advice set ?',[obj],(err,result)=>{
                if (err) throw err;
                //判断是否插入成功
                if (result.affectedRows > 0) {
                    res.send({
                        code: 200,
                        msg: 'write success'
                    });
                }

    })
  
});

//导出路由器
module.exports = router;