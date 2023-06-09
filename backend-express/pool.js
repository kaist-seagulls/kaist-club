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

function buildDataController(conn) {
  return {
    rollback: async () => {
      await conn.rollback()
    },
    commit: async () => {
      await conn.commit()
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
    },
    Subscribes: {
      filterByUser: async (userId) => {
        const result = await conn.execute(
          "SELECT clubName FROM subscribes WHERE userId = ?",
          [userId],
        )
        return result[0]
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