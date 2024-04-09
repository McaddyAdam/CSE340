<div class="card login">

    <h1><%- title %></h1>
    <p>All fields are required</p>
    <form action="/account/register" method="post">
      <label for="firstname">
        <input type="text" id="firstname" name="account_firstname" placeholder="First Name" value="">
      </label>
      <label for="lastname">
        <input type="text" id="lastname" name="account_lastname" placeholder="Last Name" value="">
      </label>
      <label for="email">
        <input type="email" id="email" name="account_email" placeholder="Email Address" value="">
      </label>
      <label for="password">
        <span class="login_pass_note">The password must be at least 12 characters and include at least one number, one lowercase letter, one capital letter, and one non-alphanumeric character (not a space).</span>
        <input type="password" id="password" name="account_password" placeholder="Password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$">
      </label>
      <input class="register_submit" type="submit" value="Register">
    </form>

  </div>