<?php
require 'juice-stand.php';
?><html>
	<head>
		<title>Juice Stand</title>
		<link rel="stylesheet" type="text/css" href="game.css"/>
		<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="index.js"></script>
	</head>

	<body>
		<header>
			<h1>Juice Stand</h1>
			<i class="fa fa-pause" id="pause"></i>
		</header>

		<div id="wrapper">
			<div id="game">
				<?php
				if ( isset( $error ) )
				{
					echo $error;
				}// end if
				?>

				<form method="post" id="sign-in-form">
					<h3>Sign In:</h3>

					<fieldset>
						<label for="sign-in-email">Email:</label><input type="email" name="email" id="sign-in-email"/>
						<label for="sign-in-password">Password:</label><input type="password" name="password" id="sign-in-password"/>
						<button id="sign-in">Sign In</button>

						<a href="#" id="sign-up-link">Need an account?</a>
					</fieldset>
				</form>

				<form method="post" id="sign-up-form">
					<h3>Sign Up:</h3>
					<fieldset>
						<label for="sign-up-email">Email:</label><input type="email" name="email" id="sign-up-email"/>
						<label for="sign-up-password">Password:</label><input type="password" name="password" id="sign-up-password"/>
						<label for="sign-up-password_confirm">Confirm Password:</label><input type="password" name="password_confirm" id="sign-up-password_confirm"/>
						<button>Sign Up</button>
						<a href="#" id="sign-in-link">Have an account? Sign in!</a>
					</fieldset>
				</form>

			</div>
		</div>

		<footer>
			&copy; <?php echo date('Y'); ?> Octopod Games
		</footer>
	</body>
</html>