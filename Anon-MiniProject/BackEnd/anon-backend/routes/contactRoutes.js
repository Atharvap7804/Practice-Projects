const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/contactcontroller");

router.post("/", sendMessage);
module.exports = router;
