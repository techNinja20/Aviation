const { v4 : uuidv4 } = require('uuid');
const bcrypt = require("bcryptjs");
const checkIfIdentityExist = require("../model")

const createNewUser = async(req, res) => {
  const { firstName, lastName, otherName, email, password, phone } = req.body;

  try {
   const [responseFromDb] = await checkIfIdentityExist(user, email)

    if(responseFromDb.length > 0) {
      throw new Error("User Already exist with this email")
    }
    
    // Store hash in your password DB
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userId = uuidv4() 

      const [results] = await insertIntoTable(user,{userId,firstName,lastName,otherName,email,salt,hash,phone})

    
    // const insertSqlQuery = 
    // "INSERT INTO User(user_id,firstName,lastName,otherName,email,passwordSalt,passwordHash,phone)VALUES(?,?,?,?,?,?,?,?)";
    // const [results] = await mysqlConnection.query(insertSqlQuery, [userId,firstName,lastName,otherName,email,salt,hash,phone])
    // console.log("results", results)

    if(results.affectedRows === 0) {
      throw new Error("Unable to insert")
    }

     res.status(200).json({
    status: true,
    message: "User created successfully",
  });
  } catch (error) {
     res.status(500).json({
    status: false,
    message: error.message,
  });
  }




} 

module.exports = {
  createNewUser
}
