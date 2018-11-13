var express = require('express');
var router = express.Router();

//引入数据库链接模块
var connection=require("./mysqlConn");

/* 添加商品分类的路由 */
router.post('/add', function(req, res, next) {
  //2. 后端路由接收前端的数据
  let {cg_fatherID,cg_name,cg_isLocked}=req.body;

  //3. 链接数据库，把数据库写入数据库
  //定义sql语句
  let sqlStr="insert into categoryGoods(cg_fatherID,cg_name,cg_isLocked) values(?,?,?)"; //占位符
  let sqlParams=[cg_fatherID,cg_name,cg_isLocked]; //参数数组
  //执行sql语句
  connection.query(sqlStr,sqlParams, function (error, results) {
    if (error) throw error; //出错对象
    //4. 返回处理的结果到前端
    //根据执行sql语句的结果返回json给前端
    //"affectedRows":1, 返回受影响的行数，如果大于0就表示成功
    if(results.affectedRows>0){
      res.send({"isOk":true,"msg":"分类添加成功!"});
    }
    else{
      res.send({"isOk":false,"msg":"分类添加失败!"});
    }
  });
});

// 获取商品分类列表的路由
router.get("/list",(req,res)=>{
   //构造sql
   let sqlStr="select t1.*,t2.cg_name as father_name from categorygoods as t1 left join categorygoods as t2 on t1.cg_fatherID=t2.cg_id";

   //执行sql
   connection.query(sqlStr,(err,datalist)=>{
      if(err) throw err;
      res.send(datalist);
   });
});

// 删除商品分类的路由
router.get("/del",(req,res)=>{
//后端路由接收要删除的id
let id=req.query.id;
let sqlStr="delete from categorygoods where cg_id=?";
let sqlParams=[id];
connection.query(sqlStr,sqlParams,function(error,result){
  if(error)throw error;

  if(result.affectedRows>0){
    res.send({"isOk":true,"msg":"账号删除成功！！"})
  }else{
    res.send({"isOk":false,"msg":"账号删除失败！！"})
  }
})

});



//3）接收新的数据并把新的数据update到数据库中
//根据id获取用户数据的路由
router.get("/getgoodsByID", (req, res) => {
  //接收用户
  let id = req.query.id;

  let sqlStr = "select * from categorygoods where cg_id=?";
  let sqlStrPamer = [id];

  connection.query(sqlStr, sqlStrPamer, function (error, userData) {
    if (error) throw error;
    res.send(userData);
  });
});
//把新旧数据库进行比较
router.post("/save", function (req, res, next) {
  let {cg_name, cg_fatherID, cg_isLocked, cg_id } = req.body;

  //链接数据库
  let sqlStr = "update categorygoods set cg_name=?,cg_fatherID=?,cg_isLocked=? where cg_id=?";
  let sqlStrPamer = [cg_name, cg_fatherID, cg_isLocked, cg_id];

  connection.query(sqlStr, sqlStrPamer, function (error, results) {
    if (error) throw error;

    if (results.affectedRows > 0) {
      res.send({ "isOk": true, "msg": "账号修改成功！！" })
    } else {
      res.send({ "isOk": false, "msg": "账号修改失败！！" })
    }
  });
});

module.exports = router;
