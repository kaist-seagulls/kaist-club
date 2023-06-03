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
const app = express()

var connectionDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
})

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
//module.exports = router;


// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => res.send("Hello World!"))

app.post("/api/v1/sign-in", (req, res) => {
  // var post = "aslkdksdl"
  var userId = "ytrewq271828"
  var password = "klasjfdkljsdkljfsda"
  req.session.isRep = false
  req.session.isAdmin = false
  if (connectionDB) {
    const queryFunc = async (userId) => {
      let queryPW = `select hashedPW, isRep, isAdmin from users where userId='${userId}';`
      return new Promise((resolve, reject) => {
        connectionDB.query(queryPW, (error, subRows) => {
          if (subRows.length == 0 || subRows != password) {
            reject(res.status(401).send("There is no account or password is wrong"))
          } else {
            resolve(subRows)
          }
        })

      })
    }
    const queryAsync = async () => {
      const result = await queryFunc(userId)

      if (result["isRep"] == 1) {
        req.session.isRep = true
        console.log("The user is a representative")
      }

      if (result["isAdmin"] == 1) {
        req.session.isAdmin = true
        console.log("The user is an admin")
      }
      req.session.isLogged = true
      req.session.userId = userId
      req.session.password = password
      res.status(200).send("Login Succeed")
    }

    queryAsync()
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
