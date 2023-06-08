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
        await task(conn)
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
