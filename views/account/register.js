// Deliver Register Activity //
<% if (title) { %>
<h1><%= title %></h1>
<% } else { res.redirect('/') } %>

<%- messages() %>

<% if (errors) { %>
<ul class="notice">
  <% errors.array().forEach(error => { %>
  <li><%= error.msg %></li>
  <%  }) %>
</ul>
<% } %>

<div id="registerContainer">
<p>All fields are required.</p>
<form id="registerForm" action="/account/register" method="post">  
  <fieldset>
    <label for="firstname">First name: </label>
    <input type="text" name="account_firstname" id="firsname" size="10" 
    required value="<%= locals.account_firstname %>">
    <label for="lastname">Last name:</label>
    <input type="text" name="account_lastname" id="lastname" 
    required value="<%= locals.account_lastname %>"></input>
    <label for="email">Email Address:</label>
    <input type="email" name="account_email" id="email" 
    required value="<%= locals.account_email %>">
    <label for="password">Password:</label>
    <input type="password" name="account_password" id="password" required 
    pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">
    <div><i>Passwords must have minimum 12 characters and include 1 capital letter, 1 number and 1 special character.</i></div> 
    <div id="pswdBtn">Show Password</div>
    <button type="submit">Register</button>
  </fieldset>
</form>
</div>
<script src="/js/script.js"></script>