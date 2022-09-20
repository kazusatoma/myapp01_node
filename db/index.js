const mysql = require('mysql')
const db = mysql.createPool(
    {
        host:'127.0.0.1',
        user:process.env.dbUser,
        password:process.env.dbPass,
        database:'my_db_01'
    }
)

module.exports = db