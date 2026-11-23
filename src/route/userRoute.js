const express = require("express");
const router  = express.Router()
const { validationMiddleWare } = require("../middleware/validation/validation");
const { userSchema } = require("../validation-joi/userValidation");
const { createNewUser } = require("../controllers/userController");


router.post("/create/user", validationMiddleWare(userSchema), createNewUser);


module.exports = router