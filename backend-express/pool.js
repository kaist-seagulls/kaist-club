const { readFileSync } = require("fs")
const SECRET = JSON.parse(readFileSync("../personal.config.json"))
const mysql = require("mysql2/promise")
const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: SECRET.mysql.password,
  database: "cs350db",
  connectionLimit: 25,
})

const getConn = async () => {
  try {
    const conn = await pool.getConnection()
    return conn
  } catch (error) {
    console.error(`connection error: ${error.message}`)
    return null
  }
}

const releaseConn = async (conn) => {
  try {
    conn.release()
  } catch (error) {
    console.error(`release error: ${error.message}`)
  }
}

/*
 * async doTransaction(task: connection -> any) -> any
 *  
 * [return values](TODO: refactoring is needed)
 *    -1: A connection is not established
 *    -2: A transaction is not started
 *    -3: There was a problem during doing the task or committing
 *    null: The task returned null and the transaction is committed
 *    others: The transaction
 */
const doTransaction = async (task) => {
  const conn = await getConn()
  if (conn) {
    await conn.beginTransaction()
    try {
      const task_result = await task(conn)
      if (task_result) {
        await conn.commit()
        return true
      } else {
        await conn.rollback()
        return false
      }
    } finally {
      await conn.rollback()
      await releaseConn(conn)
    }
  } else {
    throw null
  }
}

module.exports = {
  getConn,
  releaseConn,
  doTransaction,
}
