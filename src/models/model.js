const { mysqlConnection } = require("../config/mysqlConnect")

async function checkIfIdentityExist (tableName, condition, value){
    const sqlQuery = `SELECT * FROM ${tableName} WHERE ${condition} = ?`
    return await mysqlConnection.query(sqlQuery,[value])

}
async function checkIfOtpExist (email, otp_code){
    const sqlQuery = `SELECT * FROM otp WHERE email = ? AND otp_code = ? `
    return await mysqlConnection.query(sqlQuery,[email, otp_code])

}
async function insertIntoUserTable (tableName, data){
    const insertSqlQuery = `INSERT INTO ${tableName}(user_id,firstName,lastName,otherName,email,passwordSalt,passwordHash,phone)VALUES(?,?,?,?,?,?,?,?)`;
    return await mysqlConnection.query(insertSqlQuery,[
        data.userId, 
        data.firstName,
        data.lastName,
        data.otherName,
        data.email,
        data.salt,
        data.hash,
        data.phone
    ])
}
async function insertIntoOtpTable (tableName, data){
    console.log("oooottt", data)
    const insertSqlQuery = `INSERT INTO ${tableName}(otp_code,email,expiredAt)VALUES(?,?,?)`;
    return await mysqlConnection.query(insertSqlQuery,[
        data.otpCode, 
        data.email,
        data.expiredAt,
    ])
}

module.exports = {
    checkIfIdentityExist,
    insertIntoUserTable,
    insertIntoOtpTable,
    checkIfOtpExist
}
