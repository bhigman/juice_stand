<?php
	//print_r ($_POST);
	
	$db = new mysqli('localhost', 'bchigman', 'vehmbled', 'bchigman');
	
	if($db->connect_errno > 0){
		die('Unable to connect to database ['. $db->connect_error . ']');
	}
	
	$prep = $db->prepare("UPDATE game SET
		stand_name = ?,
		balance = ?,
		price = ?,
		game_date = ?,
		game_time = ?,
		fruit = ?,
		juice = ?,
		customers = ?
		WHERE id = ?");
	$prep->bind_param('sddssidii',
		$_POST['subName'],
		$_POST['subBalance'],
		$_POST['subPrice'],
		$_POST['subDate'],
		$_POST['subTime'],
		$_POST['subFruit'],
		$_POST['subJuice'],
		$_POST['subCust'],
		$_POST['subId']);
	$prep->execute();
	$prep->close();
	
	$db->close();
?><html>
<head>
	<link rel="stylesheet" type="text/css" href="game.css"/>
	<link rel="stylesheet" type="text/css" href="colorbox.css"/>
	<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
	<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
</head>
<body id="wrapper">
	<p>Your game is saved.<p>
	<a href="./game.php">Click here to return to your game.</a>
<body>
</html>