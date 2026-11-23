const { mysqlConnection } = require("../config/mysqlConnect")

async function checkIfIdentityExist (tableName, identity){
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${identity} = ?`
    return await mysqlConnection.query(sqlQuery,[identity])

}
async function insertIntoTable (tableName, data){
    const insertSqlQuery = `INSERT INTO ${tableName}(user_id,firstName,lastName,otherName,email,passwordSalt,passwordHash,phone)VALUES(?,?,?,?,?,?,?,?)`;
    return await mysqlConnection.query(sqlQuery,[data])

}

module.exports = {
    checkIfIdentityExist,
    insertIntoTable
}
