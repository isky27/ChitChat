const express = require("express");
const { sendMessage, allMessages } = require("../controllers/messageController");
const {protect} = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId/:page").get(protect, allMessages)


module.exports = router