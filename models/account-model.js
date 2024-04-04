const pool = require("../database/")

/* *****************************
*   Get all accounts (SELECT)
* *************************** */
async function getAccounts() {
  return await pool.query("SELECT * FROM public.account ORDER BY account_email")
}

/* *****************************
*   Register new account (INSERT)
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 * Check for existing email
 * Used for registration, func == registerAccount (desired output == 0)
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    // get account info on account_email, returns 0 or 1
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* Used for logging in, func == accountLogin (desired output == 1)
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    // get account info on account_email, returns 0 or 1 AND all account info
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    
    return result.rows[0]
  } catch (error) {
    // return if rows == 0
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using email address
* Used for logging in, func == accountLogin (desired output == 1)
* ***************************** */
async function getAccountById(account_id) {
  try {
    // get account info on account_id, returns 0 or 1 AND all account info
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    
    return result.rows[0]
  } catch (error) {
    // return if rows == 0
    return new Error("No matching account found")
  }
}

/* *****************************
* Update account data on id (desired output == 1)
* ***************************** */
async function updateAccountInfo(account_firstname, account_lastname, account_email, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4',
      [account_firstname, account_lastname, account_email, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("updateaccountinfo error " + error)
  }
}

/* *****************************
* Change account password on account_id (desired output == 1)
* ***************************** */
async function changeAccountPassword(account_password, account_id) {
  try {
    // get account info on account_id, returns all account info
    const result = await pool.query(
      'UPDATE account SET account_password = $1 WHERE account_id = $2',
      [account_password, account_id])
    return result.rowCount
  } catch (error) {
    // return if update fails
    console.error("changeaccountpassword error " + error)
  }
}

module.exports = { getAccounts, registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, changeAccountPassword, updateAccountInfo }