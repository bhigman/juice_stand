<html>
	<head>
		<title>Juice Stand</title>
		<link rel="stylesheet" type="text/css" href="css/juice-stand.min.css"/>
		<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<?php
		if ( 'index.php' == $juice_stand->get_script() )
		{
			?>
			<script src="js/juice-stand.min.js"></script>
			<?php
		}// end if
		elseif ( 'game.php' == $juice_stand->get_script() )
		{
			?>
			<script src="js/juice-stand.min.js"></script>
			<script>
				offline_mode = <?php echo $juice_stand->offline_mode ? 'true' : 'false'; ?>;
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