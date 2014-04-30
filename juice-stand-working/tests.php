<?php
require_once __DIR__ . '/includes/routing.php';

if ( 5 != juice_stand()->logged_in_user() )
{
	exit( 'invalid test user' );
}//end if
?><!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Juice Stand Tests</title>
		<link rel="stylesheet" href="http://code.jquery.com/qunit/qunit-1.14.0.css">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="js/game.js"></script>
		<script src="js/customer.js"></script>
		<script>
			offline_mode = <?php echo juice_stand()->offline_mode ? 'true' : 'false'; ?>;
		</script>
	</head>
	<body>
		<div id="qunit"></div>
		<div id="qunit-fixture"></div>

		<div id="game" style="display:none">
			<?php juice_stand()->game(); ?>
		</div>
		<script src="http://code.jquery.com/qunit/qunit-1.14.0.js"></script>
		<script src="js/tests.js"></script>
	</body>
</html>