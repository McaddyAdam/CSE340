const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver registration view (get /register)
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration (post /register)
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  
  // pass (fname, lname, email, hashpass) to model INSERT statement
  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    // continue to login view
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors:null,
    })
  } else {
    req.flash("error", "Sorry, the registration failed.")
    // render registration view again
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Deliver login view (get /login)
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  NEW Process login request (post /login)
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  // gABE returns row count == 0 || == 1 
  // ? 0 -> return error ? 1 return * accountData
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    // no account data? do not pass go, do not collect $200
    return
  }
  try {
    let match = await bcrypt.compare(account_password, accountData.account_password);
    if (match) {
      // delete password from accountData array
      // create jwt with payload containing remaining data
      delete accountData.account_password

      // use .env secret key to sign, expires in one hour
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      // can only be passed through http requests, maximum age is 1 hour
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      return res.redirect("/account/")
    } else {
      throw new Error('Access forbidden')
    }
  } catch (error) {
    // return new Error('Access Forbidden')
    req.flash("notice", "Please check your credentials and try again.")
    res.redirect("/account/login")
    return error
  }
}

/* ****************************************
*  Deliver default account view 
*  (get (route = account/) == (view = account/account))
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  let unreadMessages = await messageModel.getUnreadMessageCountByAccountId(res.locals.accountData.account_id)
  res.render("account/account", {
    title: "Account",
    nav,
    errors: null,
    unreadMessages,
  })
}

/* ****************************************
*  Deliver edit account information view 
* *************************************** */
async function buildEditAccount(req, res, next) {
  let nav = await utilities.getNav()
  let account = res.locals.accountData
  const account_id = parseInt(req.params.account_id)
  res.render("account/editaccount", {
    title: "Edit Account Information",
    nav,
    errors: null,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email,
    account_id: account_id,
  })
}

/* ****************************************
*  Process updated account info (post /editaccount)
* *************************************** */
async function editAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  
  // pass (fname, lname, email) to model UPDATE statement
  const regResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)
  if (regResult) {
    // flash message that the update was successful
    res.clearCookie("jwt")
    const accountData = await accountModel.getAccountById(account_id)
    // use .env secret key to sign, expires in one hour
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    // can only be passed through http requests, maximum age is 1 hour
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    req.flash("success", `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/account", {
      title: "Edit Account Information",
      nav,
      errors:null,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("error", "Sorry, the update failed.")
    // render account edit view again
    res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
      account_firstname: account_firstname,
      account_lastname: account_lastname,
      account_email: account_email,
    })
  }
}

/* ****************************************
*  Process updated password (post /editpassword)
* *************************************** */
async function editAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/editaccount", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  // pass (hashpass, account_id) to model UPDATE statement
  const regResult = await accountModel.changeAccountPassword(hashedPassword, account_id)
  // account account = res.locals.accountData
  if (regResult) {
    const account = await accountModel.getAccountById(account_id)
    req.flash("success", `Congratulations, ${account_firstname} you\'ve succesfully updated your account info.`)
    res.status(201).render("account/account", {
      title: "Edit Account Information",
      nav,
      errors:null,
      account_firstname: account.account_firstname,
    })
  } else {
    // const account = await accountModel.getAccountById(account_id)
    req.flash("error", "Sorry, the update failed.")
    res.status(501).render("account/editaccount", {
      title: "Edit Account Information",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Logout user
* *************************************** */
async function logoutAccount(req, res, next) {
  res.clearCookie('jwt')
  res.redirect("/")
  return
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildEditAccount, editAccountInfo, editAccountPassword, logoutAccount }