
<!-- adds h1, good seo, and a heading for the page! -->
<% if (title) { %>
  <h1><%= title %></h1>
<% } else {
  res.redirect('/')
} %>

<!-- displays messages -->
<%- messages() %>

<!-- display errors -->
<% if (errors) { %>
  <ul class="notice">
 <% errors.array().forEach(error => { %>
   <li><%= error.msg %></li>
<%  }) %>
 </ul>
<% } %>

<!-- processes for ACCOUNT management -->
<div class="form">
  <!-- account info update form -->
  <form class="register-form" action="/account/accountupdate" method="post">
    <p>* All fields are required</p>
    <fieldset class="form--fieldset register-form--fieldset"> 
      <!-- first name -->
      <label for="account_firstname">First name:</label>
      <input type="text" name="account_firstname" id="account_firstname" placeholder="Enter your first name" value="<%= locals.account_firstname %>" pattern="^[A-Za-z0-9\-']+$" autofocus required>
      
      <!-- last name -->
      <label for="account_lastname">Last name:</label>
      <input type="text" name="account_lastname" id="account_lastname" placeholder="Enter your last name" value="<%= locals.account_lastname %>" pattern="^[A-Za-z0-9\-']+$" required>
      
      <!-- email -->
      <label for="account_email">Email:</label>
      <input type="email" name="account_email" id="account_email" placeholder="Enter your email" value="<%= locals.account_email %>" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+.\.[a-zA-Z]{2,}$" required>
      
      <!-- submit -->
      <input type="submit" value="Update">
      
      <!-- id -->
      <input type="hidden" name="account_id"
      <% if(locals.account_id) { %>
        value="<%= locals.account_id %>"
      <% } %>>
    </fieldset>
  </form>

  <!-- password update form -->
  <form class="register-form" action="/account/changepassword" method="post">
    <p>* All fields are required</p>
    <fieldset class="form--fieldset register-form--fieldset">
      <!-- password -->
      <label for="account_password">Password:</label>
      <input type="password" name="account_password" id="account_password" placeholder="Pick a strong password" pattern="^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$" required>
      <p>* Passwords must have minimum 12 characters and include 1 capital letter, 1 number and 1 special character</p>
    
      <!-- submit -->
      <input type="submit" value="Change Password">
      
      <!-- id -->
      <input type="hidden" name="account_id"
      <% if(locals.account_id) { %> 
        value="<%= locals.account_id %>"
      <% } %>>
    </fieldset>
  </form>
</div>
<script src="/js/update.js"></script>
