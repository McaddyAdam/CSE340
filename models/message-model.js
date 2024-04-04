const pool = require("../database/")

/* ***************************
*  Get all message by account_id (SELECT)
* ************************** */
async function getMessagesByAccountId(account_id){
  try {
    // join account_id = message_to
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = false"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get archived messages by account_id (SELECT)
* ************************** */
async function getArchivedMessagesByAccountId(account_id){
  try {
    // join account_id = message_to
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = true"
    return await pool.query(sql, [account_id])
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get unread message count by account_id (SELECT)
* ************************** */
async function getUnreadMessageCountByAccountId(account_id){
  try {
    // join account_id = message_to
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = false AND message_read = false"
    const data = await pool.query(sql, [account_id])
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* ***************************
*  Get archived message count by account_id (SELECT)
* ************************** */
async function getArchivedMessageCountByAccountId(account_id){
  try {
    // join account_id = message_to
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON account.account_id = message.message_to WHERE message_to = $1 AND message_archived = true"
    const data = await pool.query(sql, [account_id])
    return data.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Create and send new message (INSERT)
* *************************** */
async function sendNewMessage(message_to, message_from, message_subject, message_body){
  try {
    const sql = "INSERT INTO public.message (message_to, message_from, message_subject, message_body) VALUES ($1, $2, $3, $4) RETURNING *"
    return await pool.query(sql, [message_to, message_from, message_subject, message_body])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Get message by message_id (SELECT)
* *************************** */
async function getMessageById(message_id){
  try {
    // returns all message data and account data 
    // associated with the message_from account_id
    const sql = "SELECT * FROM public.message INNER JOIN public.account ON message.message_from = account.account_id WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   mark message as read (UPDATE)
* *************************** */
async function readMessage(message_id){
  try {
    const sql = "UPDATE public.message SET message_read = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   archive message (UPDATE)
* *************************** */
async function archiveMessage(message_id){
  try {
    const sql = "UPDATE public.message SET message_archived = true WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   delete message (DELETE)
* *************************** */
async function deleteMessage(message_id){
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    return await pool.query(sql, [message_id])
  } catch (error) {
    return error.message
  }
}

// my table setup
// - message_id
// - message_to
// - message_from
// - message_subject
// - message_body
// - message_created
// - message_read
// - message_archived

module.exports = { getMessagesByAccountId, getArchivedMessagesByAccountId, getUnreadMessageCountByAccountId, getArchivedMessageCountByAccountId, sendNewMessage, getMessageById, readMessage, archiveMessage, deleteMessage }