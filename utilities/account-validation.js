const accountModel = require("../models/account-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  REGISTRATION Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to REGISTRATION
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  LOGIN Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("Please enter a valid email."),

    // password must match pattern validation
    // and must match the correct password for the account
    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .whitelist(/^[0-9a-zA-Z?!.*@]*$/)
      .isLength({ min: 12 })
      .withMessage('Incorrect password'),
  ]
}

/* ******************************
 * Check data and return errors or continue to LOGIN
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)

  if (!errors.isEmpty()) {
    // if there are errors, refresh the page and 
    // keep input values in form inputs
    // *NEVER includes passwords*
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
  }
  next()
}

/*  **********************************
 *  account UPDATE rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ]
}

/*  **********************************
 *  CHANGEPASSWORD Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to EDITACCOUNT
 * ***************************** */
validate.checkEditAccountData = async (req, res, next) => {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const account = await accountModel.getAccountById(account_id)
  if (account_email != account.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists){
      errors.push("Email exists. Please log in or use different email")
    }
  }
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.render("./account/editaccount", {
      errors,
      title: "Edit Account Information",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

// TEST ACCOUNTS
// account_firstname: Basic
// account_lastname: Client
// account_email: basic@340.edu
// account_password: I@mABas1cCl!3nt

// account_firstname: Happy
// account_lastname: Employee
// account_email: happy@340.edu
// account_password: I@mAnEmpl0y33

// account_firstname: Manager
// account_lastname: User
// account_email: manager@340.edu
// account_password: I@mAnAdm!n1strat0r

// account_firstname: Jojo
// account_firstname: Jojohn
// account_lastname: User
// account_email: jojotest@me.com
// account_password: abC123!words!
// hash: $2a$10$1IGsrSZYRJuQ4tEtaQGDo.PemXVtw7eTCSvCJWGtD.sW6e59nk67u
// account_password: abC123!different
// hash: $2a$10$BrGEjN42zOvISx1r5qBlve5d7U51JHbmEVryM0g4Y3omk//0FSo9O

module.exports = validate