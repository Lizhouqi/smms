var express = require('express');
var router = express.Router();

//加密
var md5 = require("crypto");

//引入模块
var mysql = require("mysql");


//链接数据库
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'smms'
})
//打开数据库
connection.connect();

// 添加用户的路由
router.post('/add', function (req, res, next) {
  //后端路由接收前端数据
  let { pass, username, region } = req.body;

  pass = md5.createHash("md5").update(pass).digest("hex");


  //链接数据库，把数据库写入数据库
  let sqlStr = "insert into userTable(userName,userPwd,userGroup) values(?,?,?)";

  let sqlStrPamer = [username, pass, region];



  //执行sql语句
  connection.query(sqlStr, sqlStrPamer, function (error, results) {
    if (error) throw error;

    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号添加成功！！！" })
    } else {
      res.send({ "isOk": false, "msg": "账号添加失败！！！" })
    }


  });
});


//获取用户的路由
router.get("/list", (req, res) => {
  //构造sql语句
  let sqlStr = "select * from userTable order by u_id DESC";
  //执行sql语句
  connection.query(sqlStr, function (error, userlist) {
    if (error) throw error;
    //返回查询的结果到前端
    res.send(userlist)
  });
});



//删除路由
router.get("/del",(req,res)=>{
  //后端路由接收删除的id，返回结果到前端
  let id=req.query.id;

  //构造sql
  let sqlStr="delete from userTable where u_id=?";
  let sqlStrPamer=[id];
  //执行删除sql，
  connection.query(sqlStr,sqlStrPamer,function(error,result){
    if(error)throw error;

    if(result.affectedRows>0){
      res.send({ "isOk": true, "msg": "账号删除成功！！！" })
    }else{
      res.send({ "isOk": true, "msg": "账号删除成功！！！" })
    }
  })


})
module.exports = router;
