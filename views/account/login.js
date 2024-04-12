<div class="card login">

<%- messages() %>

<h1><%- title %></h1>
<form action="/account/login" method="post">
    <label for="email"><span class="login_pass_note">Email</span>
    <input type="email" id="email" name="account_email" placeholder="Email Address"> </input>
    </label>
    <label for="password">
    <span class="login_pass_note">Password</span>
    <input type="password" id="password" name="account_password" placeholder="Password"> </input>
    </label>
    <input class="login_submit" type="submit" value="Login"> </input>
</form>

<p class="create_account">Not a member? <a href="/account/registration">Create account</a></p>
</div>