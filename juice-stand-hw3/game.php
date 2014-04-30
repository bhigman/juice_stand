<?php

require 'juice-stand.php';

$row = juice_load_game();
$u_game_time = strtotime( $row['game_time'] );

?><html>

	<head>
		<title>Juice Stand</title>
		<link rel="stylesheet" type="text/css" href="game.css"/>
		<link rel="stylesheet" type="text/css" href="colorbox.css"/>
		<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="js/jquery.colorbox-min.js"></script>
		<script src="game.js"></script>
	</head>

	<body>
		<header>
			<h1>Juice Stand</h1>
			<i class="fa fa-pause" id="pause"></i>
		</header>

		<div id="wrapper">
			<div id="game">
				<section>
					<div id="stand">
						<i class="fa fa-home"></i>
						<p><?php echo $row['stand_name']; ?></p>
					</div>
					<div id="account">
						<i class="fa fa-money"></i>
						<h2>Bank Account</h2>
						<img src="">
						<p>$<?php echo number_format( $row['balance'], 2 ); ?></p>
					</div>
					<div id="price">
						<i class="fa fa-credit-card"></i>
						<h2>Price</h2>
						<p>$<?php echo number_format( $row['price'], 2 ); ?></p>
					</div>
					<div id="updates">
						<i class="fa fa-bullhorn"></i>
						<p>
						+ $0.50 satisfied customer<br />
						- $100 fine (food poisoning)<br />
						</p>

					</div>
				</section>

				<section>
					<div id="date">
						<i class="fa fa-calendar"></i>
						<h2><?php echo date( 'M dS', strtotime( $row['game_date'] ) ); ?></h2>
						<p><span id="hour"><?php echo date( 'g', $u_game_time ); ?></span><span id="separator">:</span><span id="minute"><?php echo date( 'i', $u_game_time ); ?></span> <span id="meridiem"><?php echo date( 'A', $u_game_time ); ?></span></p>
					</div>
					<div id="inventory">
						<i class="fa fa-lemon-o"></i>
						<h2>Fruit</h2>
						<p><?php echo $row['fruit']; ?></p>
					</div>
					<div id="product">
						<i class="fa fa-tint"></i>
						<h2>Juice</h2>
						<p><?php echo number_format( $row['juice'], 3 ); ?>  mL</p>
					</div>
					<div id="customers">
						<i class="fa fa-users"></i>
						<h2>Customers</h2>
						<p><?php echo $row['customers']; ?></p>
					</div>
				</section>
			</div>
		</div>

		<footer>
			&copy; <?php echo date('Y'); ?> Octopod Games
		</footer>
	</body>
</html>