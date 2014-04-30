<?php
	require 'includes/juice-stand.php';
	$row = juice_load_game();
	// @TOOD: homework #6 - remove header whatnot
	require 'includes/header.php';
?>
<section>
	<div id="stand">
		<i class="fa fa-home"></i>
		<p><?php echo $row['stand_name']; ?></p>
	</div>
	<div id="account">
		<i class="fa fa-money"></i>
		<h2>Bank Account</h2>
		<img src="">
		<p>$<span id="account-value"><?php echo number_format( $row['balance'], 2 ); ?></span></p>
	</div>
	<div id="price">
		<i class="fa fa-credit-card"></i>
		<h2>Price</h2>
		<p>$<span id="price-value"><?php echo number_format( $row['price'], 2 ); ?></span></p>
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
	<?php $u_game_time = ( $GLOBALS['offline_mode'] ) ? 0 : strtotime( $row['game_date'] . ' ' . $row['game_time'] ); ?>
	<div id="date" data-date="<?php echo $u_game_time; ?>">
		<i class="fa fa-calendar"></i>
		<h2><?php echo date( 'M dS', $u_game_time ); ?></h2>
		<p><span id="hour"><?php echo date( 'g', $u_game_time ); ?></span><span id="separator">:</span><span id="minute"><?php echo date( 'i', $u_game_time ); ?></span> <span id="meridiem"><?php echo date( 'A', $u_game_time ); ?></span></p>
	</div>
	<div id="inventory">
		<i class="fa fa-lemon-o"></i>
		<h2>Fruit</h2>
		<p><?php echo $row['fruit']; ?></p>
		<div>
			<button data-amount="1">Buy 1 @ $0.30</button>
			<button data-amount="4">Buy 4 @ $1.00</button>
			<button data-amount="30">Buy 30 @ $6.00</button>
			<button data-amount="140">Buy 140 @ $21.00</button>
		</div>
	</div>
	<div id="product">
		<i class="fa fa-tint"></i>
		<h2>Juice</h2>
		<p><span id="product-value"><?php echo number_format( $row['juice'], 3 ); ?></span> L</p>
		<div>
			<strong>Make:</strong>
			<button data-amount="1">1</button>
			<button data-amount="10">10</button>
			<button data-amount="all">All</button>
		</div>
	</div>
	<div id="customers">
		<i class="fa fa-users"></i>
		<h2>Customers</h2>
		<p><?php echo $row['customers']; ?></p>
	</div>
</section>
<!--  @TOOD: homework #6 - remove footer whatnot -->
<?php
	require 'includes/footer.php';
?>