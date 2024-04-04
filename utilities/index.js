// const { selectFields } = require("express-validator/src/field-selection")
const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const messageModel = require("../models/message-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'

  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the single vehicle view HTML
* ************************************ */
Util.buildVehicleGrid = async function(data){
  let grid
  let vehicle = data[0]
  if(data){
    // open single vehicle view wrapper
    grid = '<div id="singleVehicleWrapper">'
    // image with alt
    grid += '<img src="' + vehicle.inv_image 
    + '" alt="Image of ' + vehicle.inv_year 
    + vehicle.inv_make + vehicle.inv_model + '">'
    // open unordered list for vehicle data
    grid += '<ul id="singleVehicleDetails">'
    // vehicle subtitle
    grid += '<li><h2>' 
    + vehicle.inv_make + ' ' + vehicle.inv_model 
    + ' Details</h2></li>'
    // formatted vehicle price
    grid += '<li><strong>Price: </strong>$' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) 
    + '</li>'
    // vehicle description
    grid += '<li><strong>Description: </strong>' + vehicle.inv_description + '</li>'
    // vehicle miles
    grid += '<li><strong>Miles: </strong>' 
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) 
    + '</li>'
    // close unordered list for vehicle data
    grid += '</ul>'
    // close single vehicle view wrapper
    grid += '</div>'

  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the broken view HTML
* ************************************ */
Util.buildBrokenPage = function(){
  let broken = ''
  return broken
}

/* ************************
 * Constructs the classification HTML select options
 ************************** */
Util.getClassSelect = async function (selectedOption) {
  let data = await invModel.getClassifications()
  let options = `<option value="">Choose a classification</option>`
  data.rows.forEach((row => {
    options += 
      `<option value="${row.classification_id}"
      ${row.classification_id === Number(selectedOption) ? 'selected': ''}>
      ${row.classification_name}
      </option>`
  }))
  return options
}

/* ************************
 * Constructs the account HTML select options
 ************************** */
Util.getAccountSelect = async function (selectedOption) {
  let data = await accountModel.getAccounts()
  let options = `<option value="">Select a Recipient</option>`
  data.rows.forEach((row => {
    options += 
      `<option value="${row.account_id}"
      ${row.account_id === Number(selectedOption) ? 'selected': ''}>
      ${row.account_firstname} ${row.account_lastname}
      </option>`
  }))
  return options
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  // if there is a token, verify it
  if (req.cookies.jwt) {
    // pass verify cookie and secret
    // call back to check for errors
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      }
    )
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check user authorization, block unauthorized users
 * ************************************ */
Util.checkAuthorization = async (req, res, next) => {
  // auth : 0
  let auth = 0
  // logged in ? next : 0
  if (res.locals.loggedin) {
    const account = res.locals.accountData
    // admin ? 1 : 0
    account.account_type == "Admin" 
      || account.account_type == "Employee" ? auth = 1 : auth = 0 
  }
  // !auth ? 404 : next()
  if (!auth) {
    req.flash("notice", "Please log in")
    res.redirect("/account/login")
    return
  } else {
    next()
  }
}

/* ************************
 * Constructs unarchived messages on account_id
 ************************** */
Util.getAccountMessages = async function (account_id) {
  let data = await messageModel.getMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No new messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => { 
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`; 
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

/* ************************
 * Constructs archived messages on account_id
 ************************** */
Util.getArchivedMessages = async function (account_id) {
  let data = await messageModel.getArchivedMessagesByAccountId(account_id)
  let dataTable
  if (data.rowCount === 0) {
    dataTable = '<h3>No archived messages</h3>'
  } else {
    dataTable = '<table id="inboxMessagesDisplay"><thead>'; 
    dataTable += '<tr><th>Read</th><th>Recieved</th><th>Subject</th><th>From</th></tr>'; 
    dataTable += '</thead>'; 
    // Set up the table body 
    dataTable += '<tbody>'; 
    // Iterate over all messages in the array and put each in a row 
    data.rows.forEach((row => {
      dataTable += `<tr><td><div class="bubble` 
        if (row.message_read) {
          dataTable += ` true"`
        } else {
          dataTable += ` false"`
        }
      dataTable += `></div></td>`; 
      dataTable += `<td>${row.message_created.toLocaleString('en-US', 'narrow')}</td>`;
      dataTable += `<td><a href='/inbox/view/${row.message_id}' title='Click to view message'>${row.message_subject}</a></td>`;
      dataTable += `<td>${row.account_firstname} ${row.account_lastname}</td></tr>`;
    })) 
    dataTable += '</tbody></table>'; 
  }
  return dataTable
}

module.exports = Util