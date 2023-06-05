// Server-side: app.js
const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const express = require("express")
const bodyParser = require("body-parser")
var mysql = require("mysql2")
var emailjs = require("emailjs")
// var router = express.Router()
var session = require("express-session")
var MySQLStore = require("express-mysql-session")(session)
// const history = require('connect-history-api-fallback');
//const { request } = require('express');
var app = express()

var connectionDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
}


var connectionDB = mysql.createConnection(options)
var sessionStore = new MySQLStore(options)

app.use(
  session({
    secret: SECRET.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
)

//var sessionStore = new MySQLStore(connectionDB)

//module.exports = router;



//app.use(history());
//app.use('/api/v1/get-clubs-related',router);

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get("/", (req, res) => res.send("Hello World!"))

app.post("/api/v1/send-auth-code", (req, res) => {
  var userId = req.body.userId
  if (connectionDB) {
    const idCheck = async (userId) => {
      let queryId = `select * from users where userId='${userId}';`
      return new Promise((resolve, reject) => {
        connectionDB.query(queryId, (error, resultRows) => {
          if (resultRows.length > 0) {
            reject(res.status(409).send("Account already exists"))
          }
          else {
            resolve(1)
          }

        })
      })
    }
    const idAuthCheck = async (userId) => {
      const already = await idCheck(userId)
      if (already !== 1) {
        throw new Error("Account check failed")
      }
      //console.assert(already !== 1, { errorMsg: "Check whether the account already exists" })
      var randNum = String(Math.floor(Math.random() * 1000000))
      var newCode = randNum.padStart(6, "0")
      let queryAuth = `select * from authCode where userId='${userId}';`

      return new Promise((resolve, reject) => {
        connectionDB.query(queryAuth, (err, authRows) => {
          // If userId - authcode pair exists
          if (queryAuth.length > 0) {
            var tempTime = authRows[0]["timeAuth"].split(/[- :]/)
            var jsTime = new Date(Date.UTC(tempTime[0], tempTime[1] - 1, tempTime[2], tempTime[3], tempTime[4], tempTime[5]))
            console.log(jsTime)
            if ((Date.now() - jsTime) / 1000 < 30) {
              reject(res.status(409).send("Issued"))
            } else {
              var oldCode = authRows[0]["authCode"]
              connectionDB.query(`update authCode set authCode=replace(authCode, '${oldCode}', '${newCode}')`, (err) => {
                if (err) throw err
              })
            }
          } else {
            connectionDB.query(`insert into authCode values('${userId}', ${newCode}, "${Date.now().toISOString().slice(0, 19).replace("T", " ")}")`, (err) => {
              if (err) throw err
            })

          }
          resolve(newCode)
        })
      })
    }
    // Send an email
    const sendAuth = async (userId) => {
      const newCode = await idAuthCheck(userId)
      emailjs.init("user_1SL5nfKY5dbyrLj2F")
      var templateParams = {
        to_name: userId,
        from_name: "KAIST Club",
        message: `Your Authentication Code is ${newCode}`,
      }
      emailjs.send("service_wpexgyv", "template_ewtrl0p", templateParams).then(function () {
        console.log("SUCCESS!")
      }, function (error) {
        console.log("FAILED...", error)
      })


      setTimeout((err, userId) => {
        if (err) throw err
        connectionDB.query(`delete from authCode where userId='${userId}';`, (err) => {
          if (err) throw err
        })
      }, 300000)

      req.status(204).send("")
    }

    sendAuth(userId).catch(() => console.log("Error occurred"))
  } else {
    throw new Error("DB Connection Failed")
  }
})

app.post("/api/v1/sign-in", (req, res) => {
  // var post = "aslkdksdl"
  var userId = req.body.userId
  var password = req.body.password
  console.log("userId: " + userId)
  req.session.isRep = false
  req.session.isAdmin = false
  if (connectionDB) {
    const queryFunc = async (userId) => {
      let queryPW = `select hashedPW, isRep, isAdmin from users where userId='${userId}';`

      return new Promise((resolve, reject) => {

        connectionDB.query(queryPW, (error, subRows) => {
          console.log("subRows: " + subRows[0].hashedPW)
          if (subRows.length == 0 || subRows[0].hashedPW != password) {
            reject(res.status(401).send("There is no account or password is wrong"))
          } else {
            resolve(subRows)
          }
        })
      })
    }
    const queryAsync = async () => {

      const result = await queryFunc(userId)
      console.log("result: " + result)

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

    queryAsync().catch(() => console.log("error occurs"))
  } else {
    throw new Error("DB Connection Failed")
  }
})
app.post("/api/v1/sign-up", (req, res) => {
  // var post = "aslkdksdl"
  var userId = req.body.userId
  var password = req.body.password
  console.log("userId: " + userId)
  req.session.isRep = false
  req.session.isAdmin = false
  if (connectionDB) {
    const queryFunc = async (userId) => {
      let queryPW = `select hashedPW, isRep, isAdmin from users where userId='${userId}';`

      return new Promise((resolve, reject) => {

        connectionDB.query(queryPW, (error, subRows) => {
          console.log("subRows: " + subRows[0].hashedPW)
          if (subRows.length == 0 || subRows[0].hashedPW != password) {
            reject(res.status(401).send("There is no account or password is wrong"))
          } else {
            resolve(subRows)
          }
        })
      })
    }
    const queryAsync = async () => {

      const result = await queryFunc(userId)
      console.log("result: " + result)

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

    queryAsync().catch(() => console.log("error occurs"))
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
    // console.log(req.session.userId)
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