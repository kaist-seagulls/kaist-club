// Server-side: app.js
const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const express = require("express")
const bodyParser = require("body-parser")
const mysql = require("mysql2")
const nodemailer = require("nodemailer")
const { StatusCodes } = require("http-status-codes")
const session = require("express-session")
const { doTransaction } = require("./pool.js")
const MySQLStore = require("express-mysql-session")(session)
const app = express()

const MIN_AUTHCODE_VALID_TIME = 30 * 1000
// const MAX_AUTOCODE_VALID_TIME = 5 * 60 * 1000

const options = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
}

const nodemailerTransportConfig = {
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
}

const buildMailParams = (userId, code) => ({
  from: "kjyeric1117@gmail.com",
  to: `${userId}@kaist.ac.kr`,
  subject: "Your Authentication Code for KAIST Club",
  html: `<div>Your Authentication Code is ${code}</div>`,
})

const generateCode = () => {
  const randNum = String(Math.floor(Math.random() * 1000000))
  return randNum.padStart(6, "0")
}

const connectionDB = mysql.createConnection(options)
const sessionStore = new MySQLStore(options)

app.use(
  session({
    secret: SECRET.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
)

//app.use(history());
//app.use('/api/v1/get-clubs-related',router);

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.get("/", (_req, res) => res.send("Hello World!"))

const findUserByUserId = async (conn, userId) => {
  const SQL_FIND_USER_BY_USERID = "SELECT * FROM users WHERE userId = ?"
  const rows = await conn.execute(SQL_FIND_USER_BY_USERID, [userId])
  return rows
}
const SQL_FIND_AUTHCODE_BY_USERID = "SELECT * FROM authCode WHERE userId = ?"
const SQL_NEW_AUTHCODE = "INSERT INTO authCode(userId, authCode, timeAuth) VALUES (?, ?, NOW())"
const SQL_RENEW_AUTHCODE_BY_USERID = "UPDATE authCode SET authCode = ?, timeAuth = NOW() WHERE userId = ?"

app.post("/api/v1/send-auth-code", (req, res) => {
  const userId = req.body.userId
  doTransaction(res, async (conn) => {
    const userRows = (await findUserByUserId(conn, userId))[0]
    // ASSUME userRows.length <= 1
    if (userRows.length > 0) {
      await conn.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }

    const authRows = (await conn.execute(SQL_FIND_AUTHCODE_BY_USERID, [userId]))[0]
    // ASSUME authRows.length <= 1
    const doesAuthCodeExists = (authRows.length > 0)
    if (doesAuthCodeExists) {
      const timeElapsed = Date.now() - authRows[0].timeAuth
      if (timeElapsed < MIN_AUTHCODE_VALID_TIME) {
        await conn.rollback()
        const timeRemaining = MIN_AUTHCODE_VALID_TIME - timeElapsed
        res.status(StatusCodes.CONFLICT).json({
          message: "issued",
          timeRemaining,
        })
        return
      }
    }

    const code = generateCode()
    let modifyResult = undefined
    if (doesAuthCodeExists) {
      modifyResult = await conn.execute(SQL_RENEW_AUTHCODE_BY_USERID, [code, userId])
    } else {
      modifyResult = await conn.execute(SQL_NEW_AUTHCODE, [userId, code])
    }
    if (modifyResult[0].affectedRows !== 1) {
      await conn.rollback()
      res.status(StatusCodes.CONFLICT).end()
      return
    }

    const transporter = nodemailer.createTransport(nodemailerTransportConfig)
    await transporter.sendMail(buildMailParams(userId, code))
    await conn.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/sign-in", (req, res) => {
  const userId = req.body.userId
  const pw = req.body.password
  console.log("userId: " + userId)
  const hashPw = (pw) => {
    return pw
  }
  doTransaction(res, async (conn) => {
    const SQL_FIND_USER_BY_SIGNIN_INFO = "SELECT * FROM Users WHERE userId = ? AND hashedPW = ?"
    const findResult = await conn.execute(SQL_FIND_USER_BY_SIGNIN_INFO, [userId, hashPw(pw)])
    if (findResult[0].length == 0) {
      await conn.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    await conn.commit()
    req.session.isLogged = true
    req.session.userId = userId
    res.status(StatusCodes.OK).end()
    return
  })
})

app.post("/api/v1/sign-up", (req, res) => {
  const userId = req.body.userId
  const password = req.body.password
  console.log("userId: " + userId)
  req.session.isRep = false
  req.session.isAdmin = false
  if (connectionDB) {
    const queryFunc = async (userId) => {
      const queryPW = "select hashedPW, isRep, isAdmin from users where userId='?';"

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
  const userId = req.session.userId
  if (userId === undefined) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  doTransaction(res, async (conn) => {
    const joinedClubs = []
    const SQL_FIND_JOINED = "SELECT clubName FROM joins WHERE userId = ?"
    const joinedClubsResult = await conn.execute(SQL_FIND_JOINED, [userId])
    for (const club of joinedClubsResult[0]) {
      joinedClubs.push({
        name: club.clubName,
        isJoined: true,
      })
    }
    const SQL_FIND_SUBSCRIBED = "SELECT clubName FROM subscribes WHERE userId = ?"
    const subscribedClubsResult = await conn.execute(SQL_FIND_SUBSCRIBED, [userId])
    const subscribedClubs = []
    for (const club of subscribedClubsResult[0]) {
      let joined = false
      for (const joinedClub of joinedClubs) {
        if (club.clubName === joinedClub.name) {
          joined = true
          break
        }
      }
      if (joined) {
        continue
      }
      subscribedClubs.push({
        name: club.clubName,
        isJoined: false,
      })
    }
    const relatedClubs = subscribedClubs.concat(joinedClubs)
    await conn.commit()
    res.status(StatusCodes.OK).json(relatedClubs)
  })
})


app.listen(3000, () => console.log("Example app listening on port 3000!"))