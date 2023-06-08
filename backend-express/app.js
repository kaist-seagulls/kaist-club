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
const MAX_AUTOCODE_VALID_TIME = 5 * 60 * 1000

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

const sessionStore = new MySQLStore(options)

app.use(
  session({
    secret: SECRET.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
)

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

const findUserByUserId = async (conn, userId) => {
  const SQL_FIND_USER_BY_USERID = "SELECT * FROM Users WHERE userId = ?"
  const rows = await conn.execute(SQL_FIND_USER_BY_USERID, [userId])
  return rows
}
const SQL_FIND_AUTHCODE_BY_USERID = "SELECT * FROM AuthCodes WHERE userId = ?"
const SQL_NEW_AUTHCODE = "INSERT INTO AuthCodes (userId, code, issuedAt) VALUES (?, ?, NOW())"
const SQL_RENEW_AUTHCODE_BY_USERID = "UPDATE AuthCodes SET code = ?, issuedAt = NOW() WHERE userId = ?"

app.post("/api/v1/send-auth-code", (req, res) => {
  if (req.session.mode === "i") {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
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
      const timeElapsed = Date.now() - authRows[0].issuedAt
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

app.post("/api/v1/check-auth-code", (req, res) => {
  if (req.session.mode === "i") {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  const userId = req.body.userId
  // console.log("check-auth-code")
  doTransaction(res, async (conn) => {
    const findResult = await conn.execute(SQL_FIND_AUTHCODE_BY_USERID, [userId])
    if (findResult[0].length === 0) {
      conn.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    const code = req.body.code
    const existingCode = findResult[0][0].code
    const timeElapsed = Date.now() - findResult[0][0].issuedAt
    if (code === existingCode && timeElapsed < MAX_AUTOCODE_VALID_TIME) {
      conn.commit()
      req.session.mode = "u"
      req.session.userId = userId
      res.status(StatusCodes.NO_CONTENT).end()
      return
    } else {
      conn.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
  })
})

const hashPw = (pw) => {
  return pw
}

app.post("/api/v1/sign-in", (req, res) => {
  const userId = req.body.userId
  const pw = req.body.password
  doTransaction(res, async (conn) => {
    const SQL_FIND_USER_BY_SIGNIN_INFO = "SELECT * FROM Users WHERE userId = ? AND hashedPw = ?"
    const findResult = await conn.execute(SQL_FIND_USER_BY_SIGNIN_INFO, [userId, hashPw(pw)])
    if (findResult[0].length == 0) {
      await conn.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    await conn.commit()
    req.session.mode = "i"
    req.session.userId = userId
    res.status(StatusCodes.OK).end()
    return
  })
})

app.post("/api/v1/sign-out", (req, res) => {
  if (req.session.mode !== "i") {
    res.status(StatusCodes.UNAUTHORIZED).end()
  }
  req.session.destroy()
  res.status(StatusCodes.NO_CONTENT).end()
})

app.post("/api/v1/sign-up", (req, res) => {
  // console.log("sign-up")
  if (req.session.mode === "i") {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  if (req.session.mode !== "u") {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthenticated",
    })
    return
  }

  const userId = req.body.userId
  if (userId !== req.session.userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthenticated",
    })
    return
  }
  const password = req.body.password
  const hashedPw = hashPw(password)
  const phone = req.body.phone

  doTransaction(res, async (conn) => {
    const userRows = (await findUserByUserId(conn, userId))[0]
    if (userRows.length > 0) {
      await conn.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }

    const SQL_ADD_USER = "INSERT INTO Users (userId, phone, hashedPw, isAdmin) VALUES (?, ?, ?, FALSE)"
    const affectedRows = (await conn.execute(SQL_ADD_USER, [userId, phone, hashedPw]))[0].affectedRows
    if (affectedRows === 0) {
      await conn.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }
    await conn.commit()
    req.session.destroy()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
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


app.listen(3000, () => console.log("[ Listening on port 3000 ]"))