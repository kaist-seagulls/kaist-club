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

app.post("/api/v1/request-newclub", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const userId = req.session.userId
  const categoryName = req.body.categoryName
  const clubName = req.body.clubName
  const description = req.body.description
  const logoImg = req.body.logoImg
  const headerImg = req.body.headerImg
  doTransaction(res, async (D) => {
    const numAddRows = await D.CreationRequests.addRequest(categoryName, clubName, description, logoImg, headerImg, userId)
    if (!numAddRows) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred",
      })
      return
    }
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/accept-newclub", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const requestId = req.body.newClubRequestId

  doTransaction(res, async (D) => {
    const isAdmin = await D.Users.isAdmin(userId)
    if (!isAdmin) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not an admin",
      })
    }

    const clubInfo = await D.CreationRequests.readRequest(requestId)
    if (!clubInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
    }
    const clubName = clubInfo["clubName"]
    const description = clubInfo["descriptions"]
    const categoryName = clubInfo["categoryName"]
    const deleteInfo = await D.CreationRequests.deleteRequest(requestId)
    if (!deleteInfo) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
    }

    const createClub = await D.Clubs.createClub(clubName, description, categoryName)
    if (!createClub) {
      res.status(StatusCodes.CONFLICT).json({
        message: "Adding club to DB failed",
      })
    }
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/send-auth-code", (req, res) => {
  if (isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "signedIn",
    })
    return
  }
  const purpose = req.body.purpose
  const userId = req.body.userId
  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (
      (purpose === "signUp" && user) ||
      (purpose === "forgotPassword" && !user)
    ) {
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
    res.status(StatusCodes.NO_CONTENT).end()
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

    const numAffectedRows = await D.Users.create(userId, phone, pw)
    if (numAffectedRows === 0) {
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

const localToUTC = (localDate) => {
  if (localDate === null) {
    return null
  }
  return new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate(),
  ))
}

app.get("/api/v1/retrieve", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  doTransaction(res, async (D) => {
    let representingClub = undefined

    let relatedClubs = undefined
    if (req.query.relatedClubs !== undefined) {
      relatedClubs = {
        joined: [],
        subscribed: [],
      }
      {
        let result = await D.Joins.filterByUser(userId)
        for (const club of result) {
          relatedClubs.joined.push(club.clubName)
        }
      }
      {
        let result = await D.Subscribes.filterByUserNotJoined(userId)
        for (const club of result) {
          relatedClubs.subscribed.push(club.clubName)
        }
      }
    }

    let events = undefined
    if (req.query.events instanceof Object) {
      events = []
      const start = req.query.events.start
      const end = req.query.events.end
      if (
        typeof (start) === "string" &&
        typeof (end) === "string"
      ) {
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
    }

    let search = undefined
    if (req.query.search !== undefined) {
      search = {
        clubs: [],
        posts: [],
      }
      let q = req.query.search.q
      if (q === undefined) {
        q = ""
      }
      if (typeof (q) === "string") {
        if (q.length > 0) {
          search.clubs = await D.Clubs.filterByQ(q)
        }
        let page = req.query.search.page
        if (typeof (page) !== "string") {
          page = 1
        } else {
          page = Number(page)
          if (!Number.isInteger(page)) {
            page = 1
          }
        }
        const filter = req.query.search.filter
        if (!Array.isArray(filter) || filter.length === 0) {
          search.posts = await D.Posts.filterByQPage(userId, q, page)
        } else {
          search.posts = await D.Posts.filterByQFilterPage(userId, q, filter, page)
        }
      }
    }

    let clubProfile = undefined
    if (typeof (req.query.clubProfile) === "string") {
      const clubName = req.query.clubProfile
      const club = await D.Clubs.lookup(clubName)
      if (club) {
        clubProfile = {
          descriptions: club.descriptions,
          categoryName: club.categoryName,
        }
      } else {
        clubProfile = null
      }
    }

    let postEdit = undefined
    if (typeof (req.query.postEdit) === "string") {
      const postId = Number(req.query.postEdit)
      if (Number.isInteger(postId)) {
        if (!representingClub) {
          const representing = await D.Represents.lookupByUser(userId)
          representingClub = representing.clubName
        }
        if (representingClub) {
          const result = await D.Posts.lookupFilterByClub(postId, representingClub)
          if (result) {
            postEdit = {
              clubName: result.clubName,
              title: result.title,
              contents: result.contents,
              start: localToUTC(result.scheduleStart),
              end: localToUTC(result.scheduleEnd),
              isRecruit: result.isRecruit,
              isOnly: result.isOnly,
            }
          } else {
            postEdit = null
          }
        } else {
          postEdit = null
        }
      } else {
        postEdit = null
      }
    }

    let clubManageInfo = undefined
    if (typeof (req.query.clubManageInfo) === "string") {
      const clubName = req.query.clubManageInfo
      if (!representingClub) {
        const representing = await D.Represents.lookupByUser(userId)
        representingClub = representing.clubName
      }
      if (representingClub === clubName) {
        clubManageInfo = {}
        clubManageInfo.applicants = await D.JoinRequests.filterByClub(clubName)
        const joinsResult = await D.Joins.filterByClub(clubName)
        clubManageInfo.members = joinsResult.map((row) => row.userId)
      } else {
        clubManageInfo = null
      }
    }

    await D.commit()
    res.status(StatusCodes.OK).json({
      relatedClubs,
      events,
      search,
      clubProfile,
      postEdit,
      clubManageInfo,
    })
    return
  })
})

app.post("/api/v1/update-user-phone", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  const phone = req.body.phone
  doTransaction(res, async (D) => {
    const numAffectedRows = await D.Users.updatePhone(userId, phone)
    if (numAffectedRows !== 1) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).end()
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/update-user-password", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  const oldPw = req.body.oldPw
  doTransaction(res, async (D) => {
    const user = await D.Users.lookupBySign(userId, oldPw)
    if (!user) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).end()
      return
    }
    const newPw = req.body.newPw
    const numAffectedRows = await D.Users.updatePw(userId, newPw)
    if (numAffectedRows !== 1) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).end()
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/reset-password", (req, res) => {
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

  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (!user) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "doesn't exist",
      })
      return
    }
    const numAffectedRows = await D.Users.updatePw(userId, pw)
    if (numAffectedRows !== 1) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).end()
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.listen(3000, () => console.log("[ Listening on port 3000 ]"))
