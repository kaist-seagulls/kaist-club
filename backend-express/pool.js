const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const mysql = require("mysql2/promise")
const { StatusCodes } = require("http-status-codes")
const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
  connectionLimit: 25,
})

const hashPw = (pw) => {
  return pw
}

const escapeQ = (q) => {
  let result = ""
  for (const c of q) {
    if (c === "#" || c === "%" || c === "_") {
      result += "#"
    }
    result += c
  }
  return result
}

function buildDataController(conn) {
  return {
    rollback: async () => {
      await conn.rollback()
    },
    commit: async () => {
      await conn.commit()
    },
    Clubs: {
      createClub: async (clubName, description, categoryName) => {
        const result = await conn.execute(
          "INSERT INTO Clubs VALUES (?, ?, ?)",
          [clubName, description, categoryName],
        )
        return result[0].affectedRows
      },
      lookup: async (clubName) => {
        const result = await conn.execute(
          "SELECT * FROM Clubs WHERE clubName = ?",
          [clubName],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      filterByQ: async (q) => {
        const escapedQ = "%" + escapeQ(q) + "%"
        const result = await conn.execute(
          `
            SELECT clubName, categoryName
            FROM Clubs
            WHERE clubName LIKE ? OR categoryName LIKE ?
          `,
          [escapedQ, escapedQ],
        )
        return result[0]
      },
    },
    Users: {
      lookup: async (userId) => {
        const result = await conn.execute(
          "SELECT * FROM Users WHERE userId = ?",
          [userId],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      lookupBySign: async (userId, pw) => {
        const result = await conn.execute(
          "SELECT * FROM Users WHERE userId = ? AND hashedPw = ?",
          [userId, hashPw(pw)],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      create: async (userId, phone, pw) => {
        const result = await conn.execute(
          "INSERT INTO Users (userId, phone, hashedPw, isAdmin) VALUES (?, ?, ?, FALSE)",
          [userId, phone, hashPw(pw)],
        )
        return result[0].affectedRows
      },
      updatePhone: async (userId, phone) => {
        const result = await conn.execute(
          "UPDATE Users SET phone = ? WHERE userId = ?",
          [phone, userId],
        )
        return result[0].affectedRows
      },
      updatePw: async (userId, newPw) => {
        const result = await conn.execute(
          "UPDATE Users SET hashedPw = ? WHERE userId = ?",
          [hashPw(newPw), userId],
        )
        return result[0].affectedRows
      },
      isAdmin: async (userId) => {
        const result = await conn.execute(
          "SELECT isAdmin FROM Users WHERE userId=?",
          [userId],
        )
        return result[0][0]["isAdmin"]
      },
    },
    CreationRequests: {
      addRequest: async (categoryName, clubName, description, headerImg, logoImg, userId) => {
        const result = await conn.execute(
          "INSERT INTO CreationRequests VALUES (?, ?, ?, NOW(), ?, ?, ?)",
          [clubName, userId, description, categoryName, logoImg, headerImg],
        )
        return result[0].affectedRows
      },
      readRequest: async (requestId) => {
        const result = await conn.execute(
          "SELECT * FROM CreationRequests WHERE requestId=?",
          [requestId],
        )
        return result[0][0]
      },
      deleteRequest: async (requestId) => {
        const result = await conn.execute(
          "DELETE FROM CreationRequests WHERE requestId=?",
          [requestId],
        )
        return result[0].affectedRows
      },
    },
    AuthCodes: {
      lookup: async (userId) => {
        const result = await conn.execute(
          "SELECT * FROM AuthCodes WHERE userId = ?",
          [userId],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      create: async (userId, code) => {
        const result = await conn.execute(
          "INSERT INTO AuthCodes (userId, code, issuedAt) VALUES (?, ?, NOW())",
          [userId, code],
        )
        return result[0].affectedRows
      },
      update: async (userId, code) => {
        const result = await conn.execute(
          "UPDATE AuthCodes SET code = ?, issuedAt = NOW() WHERE userId = ?",
          [code, userId],
        )
        return result[0].affectedRows
      },
    },
    Joins: {
      filterByUser: async (userId) => {
        const result = await conn.execute(
          "SELECT clubName FROM joins WHERE userId = ?",
          [userId],
        )
        return result[0]
      },
      filterByClub: async (clubName) => {
        const result = await conn.execute(
          "SELECT userId FROM Joins WHERE clubName = ?",
          [clubName],
        )
        return result[0]
      },
      selectUser: async (clubName) => {
        const result = await conn.execute(
          "SELECT userId from Joins WHERE clubName=?",
          [clubName],
        )
        return result[0]
      },
      checkAlreadyJoined: async (userId, clubName) => {
        const result = await conn.execute(
          "SELECT userId, clubName from joins WHERE userId=? and clubName=?",
          [userId, clubName],
        )
        return result[0]
      },
    },
    Subscribes: {
      filterByUser: async (userId) => {
        const result = await conn.execute(
          "SELECT clubName FROM subscribes WHERE userId = ?",
          [userId],
        )
        return result[0]
      },
      filterByUserNotJoined: async (userId) => {
        const result = await conn.execute(
          "SELECT clubName FROM Subscribes WHERE userId = ? AND clubName NOT IN (SELECT clubName FROM Joins WHERE userId = ?)",
          [userId, userId],
        )
        return result[0]
      },
      addSubscription: async (userId, clubName) => {
        const result = await conn.execute(
          "INSERT INTO Subscribes VALUES(?,?)",
          [userId, clubName],
        )
        return result
      },
      deleteSubscription: async (userId, clubName) => {
        const result = await conn.execute(
          "DELETE FROM Subscribes WHERE userId=? AND clubName=?",
          [userId, clubName],
        )
        return result[0]
      },
    },
    Represents: {
      lookupByUser: async (userId) => {
        const result = await conn.execute(
          "SELECT * FROM Represents WHERE userId = ?",
          [userId],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      getClubName: async (userId) => {
        const result = await conn.execute(
          "SELECT * FROM Represents WHERE userId=?",
          [userId],
        )
        return result[0]
      },
    },
    JoinRequests: {
      filterByClub: async (clubName) => {
        const result = await conn.execute(
          "SELECT userId, reqTime FROM JoinRequests WHERE clubName = ?",
          [clubName],
        )
        return result[0]
      },
      getUsers: async (clubName) => {
        const result = await conn.execute(
          "SELECT userId from JoinRequest where clubName=?",
          [clubName],
        )
        return result[0]
      },
    },
    Posts: {
      lookupFilterByClub: async (postId, clubName) => {
        const result = await conn.execute(
          "SELECT * FROM Posts WHERE postId = ? AND clubName = ?",
          [postId, clubName],
        )
        if (result[0].length == 0) {
          return null
        } else {
          return result[0][0]
        }
      },
      filterByUserRange: async (userId, start, end) => {
        const result = await conn.execute(
          `
            SELECT
              postId, clubName, color,
              title, scheduleStart, scheduleEnd,
              isRepresented
            FROM
              (
                SELECT
                  clubName,
                  (clubName IN
                    (SELECT clubName FROM Represents WHERE userId = ?)
                  ) AS isRepresented,
                  (clubName IN
                    (SELECT clubName FROM Joins WHERE userId = ?)
                  ) AS isJoined
                FROM Subscribes WHERE userId = ?
              ) AS A
              NATURAL JOIN Clubs
              NATURAL JOIN Posts
            WHERE
              (scheduleEnd >= ? AND scheduleStart <= ?)
              AND (isJoined OR (NOT isOnly))
          `,
          [userId, userId, userId, start, end],
        )
        return result[0]
      },
      countFilteredByQ: async (userId, q) => {
        const escapedQ = "%" + escapeQ(q) + "%"
        const result = await conn.execute(
          `
            SELECT
              COUNT(*) as cnt
            FROM
              (
                SELECT
                  clubName,
                  (clubName IN
                    (SELECT clubName FROM Represents WHERE userId = ?)
                  ) AS isRepresented,
                  (clubName IN
                    (SELECT clubName FROM Joins WHERE userId = ?)
                  ) AS isJoined
                FROM Clubs
              ) AS A
              NATURAL JOIN Posts
            WHERE
              (isJoined OR (NOT isOnly))
              AND (
                (
                  title LIKE ? ESCAPE '#'
                  OR
                  contents LIKE ? ESCAPE '#'
                )
              )
          `,
          [userId, userId, escapedQ, escapedQ],
        )
        return result[0][0].cnt
      },
      filterByQPage: async (userId, q, page) => {
        const escapedQ = "%" + escapeQ(q) + "%"
        const limit = 10
        const offset = limit * (page - 1)
        const limitString = String(limit)
        const offsetString = String(offset)
        const posts = await conn.execute(
          `
            SELECT
              postId, clubName, title, contents,
              scheduleStart, scheduleEnd, isRecruit, isOnly,
              uploadTime
            FROM
              (
                SELECT
                  clubName,
                  (clubName IN
                    (SELECT clubName FROM Represents WHERE userId = ?)
                  ) AS isRepresented,
                  (clubName IN
                    (SELECT clubName FROM Joins WHERE userId = ?)
                  ) AS isJoined
                FROM Clubs
              ) AS A
              NATURAL JOIN Posts
            WHERE
              (isJoined OR (NOT isOnly))
              AND (
                (
                  title LIKE ? ESCAPE '#'
                  OR
                  contents LIKE ? ESCAPE '#'
                )
              )
            ORDER BY uploadTime DESC
            LIMIT ?
            OFFSET ?
          `,
          [userId, userId, escapedQ, escapedQ, limitString, offsetString],
        )
        return posts[0]
      },
      countFilteredByQFilter: async (userId, q, filter) => {
        const escapedQ = "%" + escapeQ(q) + "%"
        let filterTupleString = "("
        if (filter.length > 0) {
          for (const i in filter) {
            if (i < filter.length - 1) {
              filterTupleString += mysql.escape(filter[i])
              filterTupleString += ","
            }
          }
          filterTupleString += mysql.escape(filter[filter.length - 1])
        }
        filterTupleString += ")"
        const result = await conn.execute(
          `
            SELECT
              COUNT(*) AS cnt
            FROM
              (
                SELECT
                  clubName,
                  (clubName IN
                    (SELECT clubName FROM Represents WHERE userId = ?)
                  ) AS isRepresented,
                  (clubName IN
                    (SELECT clubName FROM Joins WHERE userId = ?)
                  ) AS isJoined
                FROM Subscribes
                WHERE
                  userId = ?
                  AND
                  clubName IN `+ filterTupleString + `
              ) AS A
              NATURAL JOIN Posts
            WHERE
              (isJoined OR (NOT isOnly))
              AND (
                (
                  title LIKE ? ESCAPE '#'
                  OR
                  contents LIKE ? ESCAPE '#'
                )
              )
          `,
          [userId, userId, userId, escapedQ, escapedQ],
        )
        return result[0][0].cnt
      },
      filterByQFilterPage: async (userId, q, filter, page) => {
        const escapedQ = "%" + escapeQ(q) + "%"
        const limit = 10
        const offset = limit * (page - 1)
        const limitString = String(limit)
        const offsetString = String(offset)
        let filterTupleString = "("
        if (filter.length > 0) {
          for (const i in filter) {
            if (i < filter.length - 1) {
              filterTupleString += mysql.escape(filter[i])
              filterTupleString += ","
            }
          }
          filterTupleString += mysql.escape(filter[filter.length - 1])
        }
        filterTupleString += ")"
        const posts = await conn.execute(
          `
            SELECT
              postId, clubName, title, contents,
              scheduleStart, scheduleEnd, isRecruit, isOnly,
              uploadTime
            FROM
              (
                SELECT
                  clubName,
                  (clubName IN
                    (SELECT clubName FROM Represents WHERE userId = ?)
                  ) AS isRepresented,
                  (clubName IN
                    (SELECT clubName FROM Joins WHERE userId = ?)
                  ) AS isJoined
                FROM Subscribes
                WHERE
                  userId = ?
                  AND
                  clubName IN `+ filterTupleString + `
              ) AS A
              NATURAL JOIN Posts
            WHERE
              (isJoined OR (NOT isOnly))
              AND (
                (
                  title LIKE ? ESCAPE '#'
                  OR
                  contents LIKE ? ESCAPE '#'
                )
              )
            ORDER BY uploadTime DESC
            LIMIT ?
            OFFSET ?
          `,
          [userId, userId, userId, escapedQ, escapedQ, limitString, offsetString],
        )
        return posts[0]
      },
    },
  }
}

/*
   * async doTransaction(
   *   res: response,
   *   task: async (connection) -> void
   * ) -> void
   *  
   * In `task`:
   *   (1) Handle every exception except for SERVICE_UNAVAILABLE.
   *   (2) Do commit or rollback appropriately.
   */
const doTransaction = async (res, task) => {
  try {
    // If throw: -> sendGeneralError
    const conn = await pool.getConnection()
    // In CONNECTION from now on
    try {
      // If throw: -> release -> sendGeneralError
      await conn.beginTransaction()
      // In TRANSACTION from now on
      try {
        // If throw: -> rollback -> release -> sendGeneralError
        await task(buildDataController(conn))
      } catch (e) { // "rollback" TRANSACTION
        await conn.rollback()
        throw e
      }
    } finally { // "release" CONNECTION
      conn.release()
    }
  } catch { // "sendGeneralError" - ALL GENERAL EXCEPTIONS BOUND HERE
    res.status(StatusCodes.SERVICE_UNAVAILABLE).end()
  }
}

module.exports = {
  doTransaction,
}