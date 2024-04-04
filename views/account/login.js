<!-- adds h1, good seo, and a heading for the page! -->
<% if (title) { %>
  <h1><%= title %></h1>
<% } else {
  res.redirect('/')
  } %>

<!-- displays error messages -->
<%- messages() %>

<!-- display errors -->
<% if (errors) { %>
  <ul class="notice">
 <% errors.array().forEach(error => { %>
   <li><%= error.msg %></li>
<%  }) %>
 </ul>
<% } %>

<!-- display the contents of the page -->
<form id="loginForm" action="/account/login" method="post">
  <fieldset class="form--fieldset login-form--fieldset"> 
    <label for="account_email">Email:</label>
    <input type="email" id="account_email" name="account_email" placeholder="Enter your email" value="<%= locals.account_email %>" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.\.[a-zA-Z]{2,}$" autofocus required>
    
    <label for="account_password">Password:</label>
    <input type="password" id="account_password" name="account_password" placeholder="Enter your password" required>
    <p>* Passwords must have minimum 12 characters and include 1 capital letter, 1 number and 1 special character</p>
    
    <input type="submit" value="Login">
  </fieldset>
  <p>Don't have an account? <a href="/account/register">Sign up here!</a></p> 
</form>

<p>No account? <a href="/account/register"> Sign-up </a> </p>
<script src="/js/script.js"></script>