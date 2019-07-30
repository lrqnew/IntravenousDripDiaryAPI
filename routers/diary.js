const express = require('express');
//引入连接池模块
const pool = require('../pool');
//创建路由器对象
var router = express.Router();
const query = require('../query');
//写日记
router.post('/writeDiary', function (req, res) {
    //获取post请求的数据
    var obj = req.body;
    obj.dTag = obj.dTag.join(',');
    obj.writeDate = new Date().toLocaleDateString();
    //批量验证，获取每一个属性，然后判断是否为空
    // var i = 400;
    // for (var key in obj) {
    //     i++;
    //     //属性值是否为空
    //     if (!obj[key]) {
    //         res.send({
    //             code: i,
    //             msg: key + ' required'
    //         });
    //         console.log({
    //             code: i,
    //             msg: key + ' required'
    //         });
    //         return;
    //     }
    // }
    if (!obj.dContent) {
        res.send({
            code: 401,
            msg: 'dContent required'
        });
        return;
    }
    //执行sql语句
    pool.query('select dId from diary where writeDate=? and userId=?', [obj.writeDate,obj.userId], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.send({
                code: 201,
                msg: 'diary is exists'
            })
        } else {
            pool.query('insert into diary set ?', [obj], function (err, result) {
                if (err) throw err;
                //判断是否插入成功
                if (result.affectedRows > 0) {
                    res.send({
                        code: 200,
                        msg: 'write success'
                    });
                }
            });
        }
    })

});
//查询日记
router.get('/selectDiary', (req, res) => {
    var obj = req.query;
    var output = {
        count: 0,
        pageSize:parseInt(obj.pageSize),
        pageCount: 0,
        pno: obj.pno || 0,
        data: []
    };
    var sql = `select * from diary where userId= ${obj.userId} order by writeDate  desc`;
    query(sql, []).then(result => {
        output.count = result.length;
        output.pageCount = Math.ceil(output.count / output.pageSize);
        sql += ` limit ?,?`;
        return query(sql, [output.pageSize * output.pno, output.pageSize]);
    }).then(result => {
        output.data = result;
            res.send(output);
    })
});
//根据日记id查询
router.get('/diaryDetails',(req,res)=>{
    var obj=req.query;
    var sql=`select * from diary where userId=? and dId=?`;
    query(sql,[obj.userId,obj.dId]).then(result=>{
       res.send(result);
    })
});
//根据用户查询此用户的所有日记标签
router.get('/diaryTags',(req,res)=>{
    var obj=req.query;
    var sql=`select dTag from diary where userId = ?`;
    query(sql,[obj.userId]).then(result=>{
        res.send(result);
    })
});
//根据时间查询日记
router.get('/dateDiary',(req,res)=>{
    var obj=req.query;
    var sql=`select * from diary where writeDate between ? and ? and userId=?`;
    query(sql,[obj.startDate,obj.endDate,obj.userId]).then(result=>{
        res.send(result);
    })
});
//根据用户id和日记id删除日记
router.delete('/delDiary',(req,res)=>{
    var obj=req.query;
    var sql=`delete from diary where dId=? and userId=?`;
    query(sql,[obj.dId,obj.userId]).then(result=>{
        if(result.affectedRows>=1){
            res.send({code:200,msg:'delete success'})
        }
    })
});
//根据标签和用户id模糊查询日记
router.get('/SelectagDiary',(req,res)=>{
    var obj=req.query;
    var sql=`select * from diary where dTag like ? and userId=?`;
    query(sql,[`%${obj.kwd}%`,obj.userId]).then(result=>{
        res.send(result);
    })
})
//导出路由器
module.exports = router;