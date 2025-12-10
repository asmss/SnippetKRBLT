const {getUser,newUser} = require("../controllers/userController");
const express = require("express");
const router = express.Router();


router.post("/new",newUser);
router.post("/",getUser);

module.exports = router;