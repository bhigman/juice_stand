<?php
require 'includes/routing.php';
require 'includes/header.php';
?>
<form method="post" id="sign-in-form">
	<h3>Sign In:</h3>

	<fieldset>
		<div id="sign-in-error" class="error"><?php
		if ( isset( $error ) )
		{
			echo $error;
		}// end if
		?></div>

		<label for="sign-in-email">Email:</label><input type="email" name="email" id="sign-in-email"/>
		<label for="sign-in-password">Password:</label><input type="password" name="password" id="sign-in-password"/>
		<button id="sign-in">Sign In</button>

		<a href="#" id="sign-up-link">Need an account?</a>
	</fieldset>
</form>

<form method="post" id="sign-up-form">
	<h3>Sign Up:</h3>

	<fieldset>
		<div id="sign-up-error" class="error"><?php
		if ( isset( $error ) )
		{
			echo $error;
		}// end if
		?></div>

		<label for="sign-up-email">Email:</label><input type="email" name="email" id="sign-up-email"/>
		<label for="sign-up-password">Password:</label><input type="password" name="password" id="sign-up-password"/>
		<label for="sign-up-password_confirm">Confirm Password:</label><input type="password" name="password_confirm" id="sign-up-password_confirm"/>
		<div id="extended-profile">
			<label for="sign-up-name">Name:</label><input type="text" name="name" id="sign-up-name"/>
			<label for="sign-up-url">URL:</label><input type="url" name="url" id="sign-up-url"/>
			<label for="sign-up-twitter">Twitter Handle:</label><input type="text" name="twitter" id="sign-up-twitter"/>
		</div>
		<button>Sign Up</button>
		<a href="#" id="sign-in-link">Have an account? Sign in!</a>
	</fieldset>
</form>
<?php
require 'includes/footer.php';