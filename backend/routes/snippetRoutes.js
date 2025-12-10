const express = require("express");
const router = express.Router();
const {getSnippets,createSnippet,deleteSnippet} =require("../controllers/snippetController");
const {auth} = require("../middleware/auth");

router.post("/create",auth,createSnippet);
router.post("/:userId",auth,getSnippets);
router.delete("/:snippetId",auth,deleteSnippet)
module.exports = router;
