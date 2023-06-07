// Server-side: app.js
const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql2")
// const moment = require("moment")
const nodemailer = require("nodemailer")
// var router = express.Router()
const session = require("express-session")
// eslint-disable-next-line
const { getConn, releaseConn, doTransaction } = require("./pool.js")
var MySQLStore = require("express-mysql-session")(session)
var app = express()

const MIN_AUTHCODE_VALID_TIME = 30 * 1000
const MAX_AUTOCODE_VALID_TIME = 5 * 60 * 1000

var options = {
  host: "127.0.0.1",
  port: 3306,
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

const findUserByUserId = async (conn, userId) => {
  const SQL_FIND_USER_BY_USERID = "SELECT * FROM users WHERE userId = ?"
  const rows = await conn.execute(SQL_FIND_USER_BY_USERID, [userId])
  return rows
}

// const task_test = async (conn) => {
//   try {
//     const SQL = "SELECT * FROM authCode"
//     const timestamp = await conn.execute(SQL, [])
//     console.log(Date.now() - timestamp[0][0].timeAuth)
//     return null
//   } catch (e) {
//     console.log(e.message)
//   }
// }
// console.log(doTransaction(task_test))

app.post("/api/v1/send-auth-code", (req, res) => {
  var userId = req.body.userId
  const cont = async () => {
    try {
      const transactionResult = await doTransaction(async (conn) => {
        try {
          const userRes = await findUserByUserId(conn, userId)
          const userRows = userRes[0]
          if (userRows.length > 0) {
            res.status(409).send("exists")
            return false
          }
          const randNum = String(Math.floor(Math.random() * 1000000))
          const code = randNum.padStart(6, "0")
          const SQL_FIND_AUTHCODE_BY_USERID = "SELECT * FROM authCode WHERE userId = ?"
          const authRes = await conn.execute(SQL_FIND_AUTHCODE_BY_USERID, [userId])
          const authRows = authRes[0]
          if (authRows.length > 0) {
            const timeElapsed = Date.now() - authRows[0].timeAuth
            if (timeElapsed < MIN_AUTHCODE_VALID_TIME) {
              res.status(409).send("issued")
              return false
            } else {
              const SQL_RENEW_AUTHCODE_BY_USERID = "UPDATE authCode SET authCode = ?, timeAuth = NOW() WHERE userId = ?"
              const updateRes = await conn.execute(SQL_RENEW_AUTHCODE_BY_USERID, [code, userId])
              const affectedRows = updateRes[0].affectedRows
              if (affectedRows !== 1) {
                res.status(409).send()
                return false
              }
            }
          } else {
            const SQL_NEW_AUTHCODE = "INSERT INTO authCode(userId, authCode, timeAuth) VALUES (?, ?, NOW())"
            const insertRes = await conn.execute(SQL_NEW_AUTHCODE, [userId, code])
            const affectedRows = insertRes[0].affectedRows
            if (affectedRows !== 1) {
              res.status(409).send()
              return false
            }
          }

          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: "kjyeric1117@gmail.com",
              pass: "yidnstrgdfcgaikr",
            },
            tls: {
              rejectUnauthorized: false,
            },
          })

          const mailParams = {
            from: "kjyeric1117@gmail.com",
            to: `${userId}@kaist.ac.kr`,
            subject: "Your Authentication Code for KAIST Club",
            html:
              `<div>
            Your Authentication Code is ${code}
            </div>`,
          }

          transporter.sendMail(mailParams)
          return true
        } catch (e) {
          return false
        }
      })
      if (transactionResult) {
        res.status(204).send()
      }
    } catch {
      res.status(503).send()
    }
  }
  cont()
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
      let queryPW = "select hashedPW, isRep, isAdmin from users where userId='?';"

      return new Promise((resolve, reject) => {

        connectionDB.execute(queryPW, [userId], (error, subRows) => {
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
      let queryPW = "select hashedPW, isRep, isAdmin from users where userId='?';"

      return new Promise((resolve, reject) => {

        connectionDB.execute(queryPW, [userId], (error, subRows) => {
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
    const connectQuery = `start transaction; select *, 1 as rowtype from subscribes natural left join clubs where userId='?' 
                          union select *, 2 as rowtype from joins natural left join clubs where userId='?'; commit`
    connectionDB.execute(connectQuery, [req.session.userId, req.session.userId], (error, subRows) => {
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