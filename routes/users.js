var express = require('express');
var router = express.Router();

//加密
var md5 = require("crypto");

//引入模块
var connection=require("./mysqlConn");

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
router.get("/del", (req, res) => {
  //后端路由接收删除的id，返回结果到前端
  let id = req.query.id;

  //构造sql
  let sqlStr = "delete from userTable where u_id=?";
  let sqlStrPamer = [id];
  //执行删除sql，
  connection.query(sqlStr, sqlStrPamer, function (error, result) {
    if (error) throw error;

    if (result.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号删除成功！！！" })
    } else {
      res.send({ "isOk": true, "msg": "账号删除失败！！！" })
    }
  })


})


//根据id获取用户数据的路由
router.get("/getUserByID", (req, res) => {
  //接收用户
  let id = req.query.id;

  let sqlStr = "select * from userTable where u_id=?";
  let sqlStrPamer = [id];

  connection.query(sqlStr, sqlStrPamer, function (error, userData) {
    if (error) throw error;
    res.send(userData);
  });
});
//把新旧数据库进行比较
router.post("/save", function (req, res, next) {
  let { pass, username, region, u_id, oldPwd } = req.body;
  let newPass = pass;

  if (oldPwd != newPass) {
    pass = md5.createHash("md5").update(newPass).digest("hex");

  }

  //链接数据库
  let sqlStr = "update userTable set userName=?,userPwd=?,userGroup=? where u_id=?";
  let sqlStrPamer = [username, pass, region, u_id];

  connection.query(sqlStr, sqlStrPamer, function (error, results) {
    if (error) throw error;

    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号修改成功！！" })
    } else {
      res.send({ "isOk": false, "msg": "账号修改失败！！" })
    }
  });
});


router.post("/loginCheck", (req, res) => {
  // 2）后端路由接收前端传入的用户名和密码，并根据用户名和密码做数据库查询
  let { username, checkPass } = req.body;

  //加密
  checkPass = md5.createHash("md5").update(checkPass).digest("hex");

  let sqlStr = "select u_id from userTable where userName=? and userPwd=?";
  let sqlStrPamer = [username, checkPass];
  connection.query(sqlStr, sqlStrPamer, function (error, result) {
    if (error) throw error;      
    if (result.length > 0) {
      res.cookie("username", username);
      res.cookie("u_id", result[0].u_id);
      res.send({ isOk: true, msg: "用户登陆成功" })
    } else {
      res.send({ isOk: false, msg: "用户登陆失败" })
    }
  });
  // 3）后端如果查询到结果说明成功，否则失败，验证登录成功要写入cookie
  // 4）后端根据成功还是失败返回结果到前端
});

//退出销毁cookie
router.get("/signOut", (req, res) => {
  res.clearCookie("username");
  res.clearCookie("u_id");

  res.redirect("/signin.html");
});

router.get("/checkState", (req, res) => {
  var username = req.cookies.username;

  if (!username) {
    res.send("alert('非法入侵，请登陆');location.href='signin.html';");

  } else {
    res.send("")
  }
});

module.exports = router;
