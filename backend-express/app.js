// Server-side: app.js
const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const express = require("express")
const bodyParser = require("body-parser")
const nodemailer = require("nodemailer")
const { StatusCodes } = require("http-status-codes")
const session = require("express-session")
const { doTransaction } = require("./pool.js")
const MySQLStore = require("express-mysql-session")(session)
const app = express()

const MIN_AUTHCODE_VALID_TIME = 30 * 1000
const MAX_AUTHCODE_VALID_TIME = 5 * 60 * 1000

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

const isSignedIn = (req) => {
  return req.session.mode === "i"
}

const signInAs = (req, userId) => {
  req.session.mode = "i"
  req.session.userId = userId
}

const isAuthed = (req) => {
  return req.session.mode === "u"
}

const authAs = (req, userId) => {
  req.session.mode = "u"
  req.session.userId = userId
}

const userIdOf = (req) => {
  return req.session.userId
}

const sessOut = (req) => {
  req.session.destroy()
}

app.post("/api/v1/send-auth-code", (req, res) => {
  if (isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  const userId = req.body.userId
  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (user) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }

    const auth = await D.AuthCodes.lookup(userId)
    if (auth) {
      const timeElapsed = Date.now() - auth.issuedAt
      if (timeElapsed < MIN_AUTHCODE_VALID_TIME) {
        await D.rollback()
        const timeRemaining = MIN_AUTHCODE_VALID_TIME - timeElapsed
        res.status(StatusCodes.CONFLICT).json({
          message: "issued",
          timeRemaining,
        })
        return
      }
    }

    const code = generateCode()
    let numAffectedRows = undefined
    if (auth) {
      numAffectedRows = await D.AuthCodes.update(userId, code)
    } else {
      numAffectedRows = await D.AuthCodes.create(userId, code)
    }
    if (numAffectedRows !== 1) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).end()
      return
    }

    const transporter = nodemailer.createTransport(nodemailerTransportConfig)
    await transporter.sendMail(buildMailParams(userId, code))
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/check-auth-code", (req, res) => {
  if (isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  const userId = req.body.userId
  doTransaction(res, async (D) => {
    const auth = await D.AuthCodes.lookup(userId)
    if (!auth) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    const code = req.body.code
    const timeElapsed = Date.now() - auth.issuedAt
    if (code === auth.code && timeElapsed < MAX_AUTHCODE_VALID_TIME) {
      await D.commit()
      authAs(req, userId)
      res.status(StatusCodes.NO_CONTENT).end()
      return
    } else {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
  })
})

app.post("/api/v1/sign-in", (req, res) => {
  const userId = req.body.userId
  const pw = req.body.password
  doTransaction(res, async (D) => {
    const user = await D.Users.lookupBySign(userId, pw)
    if (!user) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    await D.commit()
    signInAs(req, userId)
    res.status(StatusCodes.OK).end()
    return
  })
})

app.post("/api/v1/sign-out", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  sessOut(req)
  res.status(StatusCodes.NO_CONTENT).end()
})

app.post("/api/v1/sign-up", (req, res) => {
  // console.log("sign-up")
  if (isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  if (!isAuthed(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthenticated",
    })
    return
  }

  const userId = req.body.userId
  if (userId !== userIdOf(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "unauthenticated",
    })
    return
  }
  const pw = req.body.password
  const phone = req.body.phone

  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (user) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }

    const affectedRows = await D.Users.create(userId, phone, pw)
    if (affectedRows === 0) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "exists",
      })
      return
    }
    await D.commit()
    sessOut(req)
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
  doTransaction(res, async (D) => {
    const joinedClubsResult = await D.Joins.filterByUser(userId)
    const relatedClubs = []
    for (const club of joinedClubsResult) {
      relatedClubs.push({
        name: club.clubName,
        isJoined: true,
      })
    }
    const subscribedClubsResult = await D.Subscribes.filterByUserNotJoined(userId)
    for (const club of subscribedClubsResult) {
      relatedClubs.push({
        name: club.clubName,
        isJoined: false,
      })
    }
    await D.commit()
    res.status(StatusCodes.OK).json(relatedClubs)
  })
})

app.get("/api/v1/get-user-info", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (!user) {
      await D.rollback()
      sessOut(req)
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    const phone = user.phone
    const isAdmin = user.isAdmin
    const represent = await D.Represents.lookupByUser(userId)
    const representingClub = represent ? represent.clubName : null
    res.status(StatusCodes.OK).json({
      userId,
      phone,
      isAdmin,
      representingClub,
    })
  })
})

app.get("/api/v1/retrieve", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  doTransaction(res, async (D) => {
    let relatedClubs = undefined
    if (req.query.relatedClubs) {
      relatedClubs = {
        joined: [],
        subscribed: [],
      }
      let result = await D.Joins.filterByUser(userId)
      for (const club of result) {
        relatedClubs.joined.push(club.clubName)
      }
      result = await D.Subscribes.filterByUserNotJoined(userId)
      for (const club of result) {
        relatedClubs.subscribed.push(club.clubName)
      }
    }

    let events = undefined
    if (req.query.events) {
      const localToUTC = (localDate) => {
        return new Date(Date.UTC(
          localDate.getFullYear(),
          localDate.getMonth(),
          localDate.getDate(),
        ))
      }
      const start = req.query.events.start
      const end = req.query.events.end
      events = []
      const result = await D.Posts.filterByUserRange(userId, start, end)
      for (const event of result) {
        events.push({
          postId: event.postId,
          clubName: event.clubName,
          clubColor: event.color,
          title: event.title,
          start: localToUTC(event.scheduleStart),
          end: localToUTC(event.scheduleEnd),
          isRepresented: event.isRepresented,
        })
      }
    }

    // let search = undefined
    // if (req.body.search) {
    //   const q = req.body.search.q
    //   const filter = req.body.search.filter

    // }
    await D.commit()
    res.status(StatusCodes.OK).json({
      relatedClubs,
      events,
    })
    return
  })
})

app.listen(3000, () => console.log("[ Listening on port 3000 ]"))