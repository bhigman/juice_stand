<html>
	<head>
		<title>Juice Stand</title>
		<link rel="stylesheet" type="text/css" href="css/game.css"/>
		<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<?php
		if ( 'index.php' == juice_get_script() )
		{
			?>
			<script src="js/index.js"></script>
			<?php
		}// end if
		elseif ( 'game.php' == juice_get_script() )
		{
			?>
			<link rel="stylesheet" type="text/css" href="css/colorbox.css"/>
			<script src="js/external/jquery.colorbox-min.js"></script>
			<script src="js/external/jquery.serializeobject.js"></script>
			<script src="js/game.js"></script>
			<script src="js/customer.js"></script>
			<script>
				offline_mode = <?php echo $GLOBALS['offline_mode'] ? 'true' : 'false'; ?>;
			</script>
			<?php
		}// end elseif
		?>

	</head>

	<body>
		<header>
			<h1>Juice Stand</h1>
		</header>

		<div id="wrapper">
			<div id="game">