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
const multer = require("multer")
const path = require("path")
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

// parse application/x-www-form-urlencoded
// { extended: true } : support nested object
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())


app.use(
  session({
    secret: SECRET.session.secret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  }),
)



const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
}
/*
const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFiles/post/")
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype]
    file.originalname = file.originalname.split(`.${ext}`)[0]
    //cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext)
    cb(null, file.originalname + "-" + Date.now() + "." + ext)
  },
})
*/
const storageLogo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFiles/logoImg/")
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype]
    file.originalname = file.originalname.split(`.${ext}`)[0]
    //cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext)
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + "." + ext)
  },
})
const storageHeader = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFiles/headerImg/")
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype]
    file.originalname = file.originalname.split(`.${ext}`)[0]
    //cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext)
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + "." + ext)
  },
})
const fileFilter = (req, file, cb) => {
  if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("File type not supported"), false)
  }
}
const storageClubLogo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadFiles/clubLogoImg/")
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype]
    file.originalname = file.originalname.split(`.${ext}`)[0]
    //cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext)
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + "." + ext)
  },
})

const storagePost = multer.diskStorage({
  destination: function (req, file, cb) {
    const newDestination = "uploadFiles/post/" + req.body.postId
    console.log(newDestination)
    let stat = null
    try {
      stat = readFileSync.statSync(newDestination)
    } catch (err) {
      readFileSync.mkdirSync(newDestination)
    }
    if (stat && !stat.isDirectory()) {
      throw new Error("Directory cannot be created")
    }
    cb(null, newDestination)
  },
  filename: function (req, file, cb) {
    const ext = MIME_TYPE_MAP[file.mimetype]
    file.originalname = file.originalname.split(`.${ext}`)[0]
    //cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + ext)
    cb(null, path.basename(file.originalname, ext) + "-" + Date.now() + "." + ext)
  },
})

const uploadHeader = multer({ storage: storageHeader, fileFilter: fileFilter }).single("uploadImages")
const uploadLogo = multer({ storage: storageLogo, fileFilter: fileFilter }).single("uploadImages")
const uploadClubLogo = multer({ storage: storageClubLogo, fileFilter: fileFilter }).single("uploadImages")
const uploadFuncPost = multer({ storage: storagePost, fileFilter: fileFilter })

//upload(req, res, function (err) {
//  if (err instanceof multer.MulterError) {
//    const err = new Error("Multer error")
//    next(err)
//  } else if (err) {
//    const err = new Error("File type not supported")
//    next(err)
//  }
//  next()
//})


const uploadMiddlewareLogo = (req, res, next) => {
  const upload = uploadLogo
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      const err = new Error("Multer error")
      next(err)
    } else if (err) {
      const err = new Error("File type not supported")
      next(err)
    }
    next()
  })
}
const uploadMiddlewareHeader = (req, res, next) => {
  const upload = uploadHeader
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      const err = new Error("Multer error")
      next(err)
    } else if (err) {
      const err = new Error("File type not supported")
      next(err)
    }
    next()
  })
}
const uploadMiddlewareClubLogo = (req, res, next) => {
  const upload = uploadClubLogo
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      const err = new Error("Multer error")
      next(err)
    } else if (err) {
      const err = new Error("File type not supported")
      next(err)
    }
    next()
  })
}


//app.use(uploadMiddleware)
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



app.get("/api/v1/images/post/:postId/:imageName", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  const postId = req.params.postId
  const imageName = req.params.imageName
  doTransaction(res, async (D) => {
    const post = await D.Posts.lookup(postId)
    if (!post) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).end()
      return
    }
    if (post.isOnly) {
      const clubName = post.clubName
      console.log(userId, clubName)
      const joined = await D.Joins.checkAlreadyJoined(userId, clubName)
      if (joined.length !== 1) {
        await D.rollback()
        res.status(StatusCodes.FORBIDDEN).end()
        return
      }
    }
    await D.commit()
    res.sendFile(path.join(imageName), {
      root: path.join(__dirname, "uploadFiles", "post", postId),
    })
    return
  })

})

app.post("/api/v1/get-files-for-post", (req, res) => {
  console.log("request received")
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const postId = req.body.postId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const checkExists = await D.Posts.lookupFilterByClub(postId, clubName)
    if (checkExists.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
    }

    console.log("dsasdasdaasd")
    const fileRows = await D.PostFiles.lookupByPostId(postId)
    console.log(fileRows)
    const fileNum = fileRows.length
    if (fileNum === 0) {
      res.status(StatusCodes.NO_CONTENT).end()
      return
    }
    for (let i = 0; i < fileNum; i++) {
      const fileName = fileRows[0][i]["imageName"]
      res.download(`uploadFiles/post/${fileName}`)
    }
  })
})

app.post("/api/v1/send-files-for-post", uploadFuncPost.array("uploadImages", 5), (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const userId = req.session.userId
  const postId = req.body.postId
  const clubName = req.body.clubName

  doTransaction(res, async (D) => {
    const represented = await D.Represents.lookupByUser(userId)

    if (represented !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const checkPost = await D.Posts.lookupFilterByClub(postId, clubName)
    if (!checkPost) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
      return
    }
    /*
    const uploadWithId = uploadFuncPost(postId)
    uploadWithId(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const err = new Error("Multer error")
        throw err
      } else if (err) {
        const err = new Error("File type not supported")
        throw err
      }
    })
    */
    console.log(req.files)
    for (const file of req.files) {
      const fileName = file.filename
      const insertFile = await D.PostFiles.insert(postId, clubName, fileName)
      if (!insertFile) {
        await D.rollback()
        res.status(StatusCodes.CONFLICT).json({
          message: "Conflict occurred while processing files",
        })
        return
      }
    }

    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.get("/api/v1/get-header-for-creation-request", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const requestId = req.body.requestId
  console.log(requestId)
  doTransaction(res, async (D) => {
    console.log("dddd")
    const checkExists = await D.CreationRequests.lookupByRequestId(requestId)
    if (!checkExists) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
    }

    const fileRows = await D.CreationRequestFiles.lookupHeaderByRequestId(requestId)
    console.log(fileRows)
    const fileName = fileRows["imageName"]
    console.log(fileName)
    res.download(`uploadFiles/headerImg/${fileName}`)
  })
})
app.get("/api/v1/get-logo-for-creation-request", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const requestId = req.body.requestId
  doTransaction(res, async (D) => {
    const checkExists = await D.CreationRequests.lookupByRequestId(requestId)
    if (checkExists.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
    }

    const fileRows = await D.CreationRequestFiles.lookupLogoByRequestId(requestId)

    const fileName = fileRows["imageName"]
    console.log(fileName)
    res.download(`uploadFiles/logoImg/${fileName}`)

  })
})

app.post("/api/v1/send-logo-for-creation-request", uploadMiddlewareLogo, (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const requestId = req.body.requestId

  doTransaction(res, async (D) => {

    const checkRequest = await D.CreationRequests.lookupByRequestId(requestId)
    if (!checkRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Request not found",
      })
      return
    }

    console.log(req.file.filename)

    const fileName = req.file.filename
    const insertFile = await D.CreationRequestFiles.insertLogo(requestId, fileName)
    if (!insertFile) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while processing files",
      })
      return
    }

    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.post("/api/v1/send-header-for-creation-request", uploadMiddlewareHeader, (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const requestId = req.body.requestId

  doTransaction(res, async (D) => {
    console.log("dkdkdkdkdkd")
    const checkRequest = await D.CreationRequests.lookupByRequestId(requestId)
    if (!checkRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Request not found",
      })
      return
    }
    const fileName = req.file.filename
    const insertFile = await D.CreationRequestFiles.insertHeader(requestId, fileName)
    if (!insertFile) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while processing files",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.get("/api/v1/get-club-logo-for-clubs", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const checkExists = await D.Clubs.lookup(clubName)
    if (checkExists.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Club not found",
      })
    }

    const fileRows = await D.ClubFiles.lookupByClubName(clubName)

    const fileName = fileRows["logoFileName"]
    console.log(fileName)
    res.download(`uploadFiles/clubLogoImg/${fileName}`)

  })
})

app.post("/api/v1/send-club-logo-for-clubs", uploadMiddlewareClubLogo, (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  const clubName = req.body.clubName
  const userId = req.session.userId

  doTransaction(res, async (D) => {
    const checkRep = await D.Represents.lookupByUser(userId)
    console.log(userId)
    if (checkRep !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }

    const checkExists = await D.Clubs.lookup(clubName)
    if (checkExists.length === 0) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Club not found",
      })
    }
    console.log("sdsdsadsd")

    const fileName = req.file.filename
    const insertFile = await D.ClubFiles.insert(clubName, fileName)
    if (!insertFile) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while processing files",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/request-newclub", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
  }
  console.log("adsasdsdasda")
  const userId = req.session.userId
  const categoryName = req.body.categoryName
  const clubName = req.body.clubName
  const description = req.body.description
  const logoImg = req.body.logoImg
  const headerImg = req.body.headerImg
  doTransaction(res, async (D) => {
    const numAddRows = await D.CreationRequests.insertRequest(null, categoryName, clubName, description, logoImg, headerImg, userId)
    if (!numAddRows) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred",
      })
      return
    }
    await D.commit()
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
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not an admin",
      })
    }

    const clubInfo = await D.CreationRequests.lookupByRequestId(requestId)
    if (!clubInfo) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
    }
    const clubName = clubInfo["clubName"]
    const description = clubInfo["descriptions"]
    const categoryName = clubInfo["categoryName"]
    const deleteInfo = await D.CreationRequests.deleteRequest(requestId)
    if (!deleteInfo) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
    }

    const createClub = await D.Clubs.insertClub(clubName, description, categoryName)
    if (!createClub) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Adding club to DB failed",
      })
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/deny-newclub", (req, res) => {
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
    if (isAdmin) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not an admin",
      })
      return
    }
    const deleteInfo = await D.CreationRequests.deleteRequest(requestId)
    if (!deleteInfo) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/update-club-profile", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubProfileNew = req.body.clubProfile
  doTransaction(res, async (D) => {
    const clubName = await D.Represents.lookupByUser(userId)
    if (!clubName || clubName !== clubProfileNew["name"]) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a representative",
      })
      return
    }
    const clubRow = await D.Clubs.lookup(clubName)
    if (!clubRow.length) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Representing club does not exist",
      })
      return
    }
    const clubDescription = clubProfileNew["description"]
    const clubCategory = clubRow["category-id"]
    const clubColor = clubRow["color"]

    const updateResult = await D.Clubs.update(clubDescription, clubCategory, clubColor, clubName)
    if (!updateResult) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict during update",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/delete-club", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed In",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const isAdmin = await D.Users.isAdmin(userId)
    if (!isAdmin) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not an admin",
      })
    }
    const clubRow = await D.Clubs.lookup(clubName)
    if (!clubRow.length) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Club not found",
      })
    }
    const deleteResult = await D.Clubs.delete(clubName)
    if (!deleteResult) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Club not found",
      })
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/request-handover", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const repId = req.session.userId
  const userId = req.body.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const clubRow = await D.Represents.lookupByUser(repId)
    if (clubRow.length !== 0 || clubRow["clubName"] !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a representative",
      })
      return
    }
    const handoverRow = await D.HandoverRequests.insert(repId, userId, clubName)
    if (!handoverRow) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Handover Failed",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.post("/api/v1/accept-handover", (req, res) => {
  const sess = req.session
  const userId = req.session.userId
  const handoverId = req.body.handoverId
  doTransaction(res, async (D) => {
    if (sess.islogged === false) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized access",
      })
      return
    }
    const checkAdminResult = await D.Users.isAdmin(userId)
    if (checkAdminResult.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden",
      })
      return
    }
    const handoverRow = await D.HandoverRequests.lookup(handoverId)
    if (!handoverRow.length) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Handover Request Not Found",
      })
      return
    }
    const clubName = handoverRow["clubName"]
    const newRep = handoverRow["toId"]
    const deleteRequest = await D.HandoverRequests.delete(handoverId)
    if (!deleteRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Handover Request Not Found",
      })
      return
    }
    const updateRows = await D.Represents.update(clubName, newRep)
    if (!updateRows) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while updating representative info",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.post("/api/v1/deny-handover", (req, res) => {
  const sess = req.session
  const userId = req.session.userId
  const handoverId = req.body.handoverId
  doTransaction(res, async (D) => {
    if (sess.islogged === false) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized access",
      })
      return
    }
    const checkAdminResult = await D.Users.isAdmin(userId)
    if (checkAdminResult.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden",
      })
      return
    }
    const handoverRow = await D.HandoverRequests.lookup(handoverId)
    if (!handoverRow.length) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Handover Request Not Found",
      })
      return
    }
    const deleteRequest = await D.HandoverRequests.delete(handoverId)
    if (!deleteRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Handover Request Not Found",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})



app.post("/api/v1/request-join", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const insertRequest = await D.JoinRequests.insert(userId, clubName)
    if (!insertRequest) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while processing request",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/accept-join", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const checkRep = await D.Represents.lookupByUser(userId)
    if (checkRep["clubName"] !== clubName || checkRep.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const deleteRequest = await D.JoinRequests.delete(userId, clubName)
    if (!deleteRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No request was found",
      })
      return
    }
    const insertJoins = await D.Joins.insert(userId, clubName)
    if (!insertJoins) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while processing requests",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/deny-join", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const checkRep = await D.Represents.lookupByUser(userId)
    if (checkRep["clubName"] !== clubName || checkRep.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const deleteRequest = await D.JoinRequests.delete(userId, clubName)
    if (!deleteRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No request was found",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/get-outta-my-club-dude", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.FORBIDDEN).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  doTransaction(res, async (D) => {
    const checkRep = await D.Represents.lookupByUser(userId)
    if (checkRep["clubName"] !== clubName || checkRep.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const deleteRequest = await D.Joins.delete(userId, clubName)
    if (!deleteRequest) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "No request was found",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})

app.post("/api/v1/create-post", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userId
  const clubName = req.body.clubName
  const postInfo = req.body.postInfo
  doTransaction(res, async (D) => {
    const represented = await D.Represents.lookupByUser(userId)
    console.log("checkRep", represented)
    if (!represented || represented !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const insertResult = await D.Posts.insert(clubName, postInfo["title"], postInfo["content"],
      postInfo["schedule"]["startDate"], postInfo["schedule"]["endDate"], postInfo["isRecruitment"], postInfo["isOnly"])
    console.log(insertResult)
    if (!insertResult) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while creating a post",
      })
    }

    await D.commit()
    res.status(StatusCodes.OK).json({ postId: insertResult })
    return
  })
})

app.post("/api/v1/update-post", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userID
  const clubName = req.body.clubName
  const postId = req.body.postId
  const postInfo = req.body.postInfo
  doTransaction(res, async (D) => {
    const checkRep = D.Represents.lookupByUser(userId)
    if (checkRep.length === 0 || checkRep["clubName"] !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const checkExists = D.Posts.lookupFilterByClub(postId, clubName)
    if (checkExists.length === 0) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
      return
    }
    const updateRows = D.Posts.update(postId, clubName, postInfo)
    if (!updateRows) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Conflict occurred while updating a post",
      })
      return
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT).end()
    return
  })
})
app.post("/api/v1/delete-post", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Not signed in",
    })
    return
  }
  const userId = req.session.userID
  const clubName = req.body.clubName
  const postId = req.body.postId
  doTransaction(res, async (D) => {
    const checkRep = D.Represents.lookupByUser(userId)
    if (checkRep.length === 0 || checkRep["clubName"] !== clubName) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not a club representative",
      })
      return
    }
    const deleteResult = D.Posts.delete(postId)
    if (!deleteResult) {
      await D.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Post not found",
      })
    }
    await D.commit()
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
      numAffectedRows = await D.AuthCodes.insert(userId, code)
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

    const numAffectedRows = await D.Users.insert(userId, phone, pw)
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

app.get("/api/v1/get-admin-info", (req, res) => {
  const userId = req.session.userId
  doTransaction(res, async (conn) => {
    if (!isSignedIn(req)) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Not signed in",
      })
      return
    }
    const checkAdminResult = await conn.Users.isAdmin(userId)
    if (checkAdminResult.length === 0) {
      await conn.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden",
      })
      return
    }
    console.log("344")
    const readClubResult = (await conn.Clubs.lookupAdmin())
    const readRequestResult = (await conn.CreationRequests.lookupAdmin())
    const readHandoverResult = (await conn.HandoverRequests.lookupAdmin())
    if (readClubResult.length === 0 || readRequestResult.length === 0 || readHandoverResult.length === 0) {
      await conn.rollback()
      res.status(StatusCodes.NOT_FOUND).json({
        message: "Not found",
      })
      return
    }
    const clubs = []
    const requests_new_club = []
    const requests_handover = []

    for (let i = 0; i < readClubResult.length; i++) {
      clubs.push(readClubResult[i]["clubName"])
    }
    for (let j = 0; j < readRequestResult.length; j++) {
      let dic = {}
      dic["requestId"] = readRequestResult[j]["requestId"]
      dic["categoryName"] = readRequestResult[j]["categoryName"]
      dic["clubName"] = readRequestResult[j]["clubName"]
      dic["descriptions"] = readRequestResult[j]["descriptions"]
      dic["userId"] = readRequestResult[j]["userId"]
      dic["reqTime"] = readRequestResult[j]["reqTime"]

      requests_new_club.push(dic)
    }
    for (let k = 0; k < readHandoverResult.length; k++) {
      let dic = {}
      dic["requestId"] = readHandoverResult[k]["requestId"]
      dic["clubName"] = readHandoverResult[k]["clubName"]
      dic["fromId"] = readHandoverResult[k]["fromId"]
      dic["toId"] = readHandoverResult[k]["toId"]
      requests_handover.push(dic)
    }
    const returnDic = {}
    returnDic["currentClubs"] = clubs
    returnDic["requestsNewClub"] = requests_new_club
    returnDic["requestsHandover"] = requests_handover
    res.status(StatusCodes.OK).json(returnDic)
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
//const SQL_CHECK_REP = "SELECT * FROM Represents WHERE userId=?"
//const SQL_CHECK_JOINREQUESTS = "SELECT userId from JoinRequest where clubName=?"
//const SQL_CHECK_USERS = "SELECT userId from Joins WHERE clubName=?"

app.get("/api/v1/get-club-management-info", (req, res) => {

  const sess = req.session
  const userId = req.session.userId

  doTransaction(res, async (D) => {
    if (sess.islogged === false) {
      await D.rollback()
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized access",
      })
      return
    }
    console.log("asdksdaklsdakl")
    const checkRepResult = await D.Represents.lookupByClubName(userId)
    if (checkRepResult.length === 0) {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).json({
        message: "Forbidden",
      })
      return
    }
    const clubName = checkRepResult[0]["clubName"]
    const applicants = []
    const checkJoinRequests = await D.JoinRequests.lookupByClubName(clubName)

    for (let i = 0; i < checkJoinRequests.length; i++) {
      applicants.push(checkJoinRequests[i]["userId"])
    }
    const members = []
    const checkMembers = await D.Joins.filterby(clubName)

    for (let j = 0; j < checkMembers.length; j++) {
      members.push(checkMembers[j]["userId"])
    }

    const clubManagementInfo = {}
    clubManagementInfo["applicants"] = applicants
    clubManagementInfo["members"] = members
    const returnDic = {}
    returnDic["clubManagementInfo"] = clubManagementInfo
    await D.commit()
    res.status(StatusCodes.OK).json(returnDic)
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
  const authority = req.query.requiredAuthority
  if (authority === "n") {
    if (isSignedIn(req)) {
      res.status(StatusCodes.FORBIDDEN).end()
    } else {
      res.status(StatusCodes.OK).end()
    }
    return
  }
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  doTransaction(res, async (D) => {
    const user = await D.Users.lookup(userId)
    if (!user) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).end()
      return
    }
    const isAdmin = user.isAdmin
    if (authority === "a") {
      if (!isAdmin) {
        await D.rollback()
        res.status(StatusCodes.FORBIDDEN).end()
        return
      }
    }

    let representingClub = undefined
    const clubName = await D.Represents.lookupByUser(userId)
    if (clubName) {
      representingClub = clubName
    } else if (authority === "r") {
      await D.rollback()
      res.status(StatusCodes.FORBIDDEN).end()
      return
    }

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
    if (typeof (req.query.events) === "object") {
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
    if (typeof (req.query.search) === "object") {
      search = {
        clubs: [],
        posts: [],
      }
      let q = req.query.search.q
      if (typeof (q) !== "string") {
        q = ""
      }
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
      let posts = []
      if (!Array.isArray(filter) || filter.length === 0) {
        search.numPosts = await D.Posts.countFilteredByQ(userId, q)
        posts = await D.Posts.filterByQPage(userId, q, page)
      } else {
        search.numPosts = await D.Posts.countFilteredByQFilter(userId, q, filter)
        posts = await D.Posts.filterByQFilterPage(userId, q, filter, page)
      }
      for (const post of posts) {
        const postId = post.postId
        post.images = []
        const images = await D.PostFiles.lookupByPostId(postId)
        for (const image of images) {
          post.images.push(image.imageName)
        }
      }
      search.posts = posts
    }

    let clubProfile = undefined
    if (typeof (req.query.clubProfile) === "string") {
      const clubName = req.query.clubProfile
      const club = await D.Clubs.lookup(clubName)
      if (club) {
        clubProfile = {
          clubName: club.clubName,
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
    if (req.query.clubManageInfo !== undefined) {
      if (representingClub) {
        clubManageInfo = {}
        clubManageInfo.applicants = await D.JoinRequests.filterByClub(representingClub)
        const joinsResult = await D.Joins.filterByClub(representingClub)
        clubManageInfo.members = joinsResult.map((row) => row.userId)
      }
    }

    await D.commit()
    res.status(StatusCodes.OK).json({
      userId,
      representingClub,
      isAdmin,
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

app.post("/api/v1/create-subscription", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  const clubName = req.clubName
  doTransaction(res, async (D) => {
    const joinedUser = await D.Joins.checkAlreadyJoined(userId, clubName)
    if (joinedUser.length !== 0) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Joined",
      })
      return
    }
    else {
      const insertSubscription = await D.Subscribes.insertSubscription(userId, clubName)
      if (!insertSubscription) {
        await D.rollback()
        res.status(StatusCodes.CONFLICT).json({
          message: "Already Subscribed",
        })
        return
      }
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT)
  })
})
app.post("/api/v1/delete-subscription", (req, res) => {
  if (!isSignedIn(req)) {
    res.status(StatusCodes.UNAUTHORIZED).end()
    return
  }
  const userId = userIdOf(req)
  const clubName = req.clubName
  doTransaction(res, async (D) => {
    const joinedUser = await D.Joins.checkAlreadyJoined(userId, clubName)
    if (joinedUser.length !== 0) {
      await D.rollback()
      res.status(StatusCodes.CONFLICT).json({
        message: "Joined",
      })
      return
    }
    else {
      const addSubscription = await D.Subscribes.deleteSubscription(userId, clubName)
      if (!addSubscription) {
        await D.rollback()
        res.status(StatusCodes.CONFLICT).json({
          message: "Deleting Subscription Failed",
        })
        return
      }
    }
    await D.commit()
    res.status(StatusCodes.NO_CONTENT)
  })
})
app.listen(3000, () => console.log("[ Listening on port 3000 ]"))