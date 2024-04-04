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

<% let account = locals.accountData %>
<% if (locals.loggedin) { %>
  <h2>Welcome <%= locals.accountData.account_firstname %></h2>
  <div class="management-links">
    <a href="/account/edit/<%= locals.accountData.account_id %>">Manage Your Account Information</a>
  </div>
  <h2>Message Center</h2>
  <p>you have <%= locals.unreadMessages %> unread messages</p>
  <div class="management-links">
    <a href="/inbox/">Inbox</a>
    <!-- ad :account_id to this route maybe ^^ -->
  </div>
  <% if (account.account_type == "Employee" || account.account_type == "Admin") { %>
    <h3>Inventory Management</h3>
    <div class="management-links">
      <a href="/inv/">Manage inventory</a>
    </div>
  <% } %>
<% } %>