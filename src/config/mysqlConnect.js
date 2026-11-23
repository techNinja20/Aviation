require('dotenv').config()
const mysql = require("mysql2/promise");

// Create the connection to database
 const mysqlConnection = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT
});

module.exports = {mysqlConnection}
