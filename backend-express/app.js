// Server-side: app.js
const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const express = require("express")
const bodyParser = require("body-parser")
var mysql = require("mysql2")
// var router = express.Router()
var session = require("express-session")
var MySQLStore = require("express-mysql-session")(session)
// const history = require('connect-history-api-fallback');
//const { request } = require('express');

var connectionDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
})

const app = express()

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(
  session({
    secret: SECRET.session.secret,
    store: new MySQLStore({
      host: "127.0.0.1",
      user: "root",
      password: SECRET.mysql.password,
      database: "cs350db",
    }),
    resave: false,
    saveUninitialized: false,
  }),
)

app.get("/", (req, res) => res.send("Hello World!"))

app.post("/api/v1/sign-in", (req, res) => {
  var post = req.body
  var userId = post.userId
  var password = post.password
  if (connectionDB) {
    if (/*데이터베이스 안에 useId가 있는지 확인 && 해당 아이디에 password가 맞는지*/1) {
      var bodyList = new Array()
      req.session.isLogged = true
      req.session.userId = userId
      req.session.password = password
      res.status(200).send("Login completed")
    } else {
      res.status(401).send("There is no account or password is wrong")
    }
  } else {
    throw new Error("DB Connection Failed")
  }
})

app.get("/api/v1/get-clubs-related", (req, res) => {
  //var session = req.session;
  req.session.userId = "ytrewq271828"
  // var subRows
  // var joinRows
  //let bodyList = [];
  if (connectionDB) {
    console.log(req.session.userId)
    //bodyList = new Array();
    connectionDB.query(`select *, 1 as rowtype from subscribes natural left join clubs where userId='${req.session.userId}' union select *, 2 as rowtype from joins natural left join clubs where userId='${req.session.userId}';`, (error, subRows) => {
      // console.log(subRows);
      const bodyList = new Array()
      if (error) throw error
      //console.log(subRows.length);
      for (var i = 0; i < subRows.length; i++) {
        var isJoined = true
        //console.log(connectionDB.query(`select exists(select * from joins where userId='${req.session.userId}');`));
        if (subRows[i]["rowtype"] == 1) {
          isJoined = false
        }
        bodyList.push({
          id: subRows[i]["clubId"],
          name: subRows[i]["clubName"],
          isJoined: isJoined,
        })
      }
      //console.log(bodyList);
      res.send(bodyList)
    })
  } else {
    throw new Error("DB Connection Failed")
  }
})


app.listen(3000, () => console.log("Example app listening on port 3000!"))
