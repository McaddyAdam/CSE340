// Needed Resources 
const express = require("express")
const router = new express.Router() 
const messageController = require("../controllers/messageController")
const { handleErrors } = require("../utilities")
const validate = require("../utilities/message-validation")

// INDEX
// Route to build inbox/inbox view
router.get("/", handleErrors(messageController.buildInbox));

// ARCHIVED MESSAGES
// Route to build inbox/archivedmessages view
router.get("/archivedmessages", handleErrors(messageController.buildArchivedMessages));

// SEND
// Route to build inbox/sendmessage view
router.get("/send", handleErrors(messageController.buildSendMessage));

// Route to build inbox/sendmessage view
router.post(
  "/send", 
  validate.messageRules(),
  validate.checkMessageData,
  handleErrors(messageController.sendMessage)
);

// VIEW
// Route to build inbox/viewmessage view
router.get("/view/:message_id", handleErrors(messageController.buildViewMessage));

// REPLY
// Route to build account reply message view
router.get("/reply/:message_id", handleErrors(messageController.buildReplyMessage));

// Route to build account reply message view
router.post(
  "/reply",
  validate.replyRules(),
  validate.checkReplyData,
  handleErrors(messageController.replyMessage)
);

// READ
// Route to set message_read = true
router.get("/read/:message_id", handleErrors(messageController.readMessage));

// ARCHIVE
// Route to set message_archived = true
router.get("/archive/:message_id", handleErrors(messageController.archiveMessage));

// DELETE
// Route to delete a message
router.get("/delete/:message_id", handleErrors(messageController.deleteMessage));

module.exports = router