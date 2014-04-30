<?php
	// load data from data.txt
	$file = file_get_contents("data.txt");
	$info = explode("\n",$file);
	
	foreach($info as $x => $y){
		$item = explode(':', $y);
		$info[$x] = $item;
		
		if($x == 4 || $x == 5){
			$date = $item[1];
			$bits = explode("-",$date);
			$item[1] = $bits;
			$info[$x] = $item;
		}
	}
	$sday = $info[4][1][1];
	$smonth = $info[4][1][2];
	$syear = $info[4][1][0];
	//print_r($info);
	//echo date("F jS", mktime(0,0,0,5,26,2014));
?>
<html>

	<head>
		<title>Juice Stand</title>
		<link rel="stylesheet" type="text/css" href="game.css"/>
		<link href="//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css" rel="stylesheet">
		<link href='http://fonts.googleapis.com/css?family=Averia+Sans+Libre' rel='stylesheet' type='text/css'>
		<script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
		<script src="game.js"></script>
	</head>

	<body>
		<header>
			<h1>Juice Stand</h1>
		</header>
		
		<div id="wrapper">
			<div id="game">
				<section>
					<div id="stand">
						<i class="fa fa-home fa-lg"></i>
						<p><?= $info[0][1] ?></p>
					</div>
					<div id="account">
						<h2><i class="fa fa-money fa-lg"></i> Bank Account</h2>
						<p>$<?=$info[1][1]?>.00</p>
					</div>
					<div id="price">
						<h2><i class="fa fa-credit-card fa-lg"></i> Price</h2>
						<p>$<?=$info[2][1]?></p>
					</div>
					<div id="updates">
						<!-- this is placeholder for now, we'll come back to this later -->
						<i class="fa fa-lightbulb-o fa-lg"></i>
						<p class="updates">
						+ $0.50 satisfied customer<br />
						- $100 fine (food poisoning)<br />
						</p>
					</div>
				</section>

				<section>
					<div id="date">
						<h2><i class="fa fa-calendar fa-lg"></i> <?= date("F jS", mktime(0,0,0,$sday,$smonth,$syear));?></h2>
						<p><span id="hour">8</span><span id="separator">:</span><span id="minute">00</span> <span id="meridiem">AM</span></p>
					</div>
					<div id="inventory">
						<h2><i class="fa fa-lemon-o fa-lg"></i> Fruit</h2>
						<p><?=$info[7][1]?></p>
					</div>
					<div id="product">
						<h2><i class="fa fa-tint fa-lg"></i> Juice</h2>
						<p><?=$info[6][1]?>  mL</p>
					</div>
					<div id="customers">
						<h2><i class="fa fa-users fa-lg"></i> Customers</h2>
						<p><?=$info[3][1]?></p>
					</div>
				</section>
			</div>
		</div>

		<footer>
			&copy; <?= date("Y") ?> Octopod Games
		</footer>
	</body>
</html>