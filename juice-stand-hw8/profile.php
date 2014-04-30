<?php
require 'includes/routing.php';
require 'includes/header.php';

$user_id = isset( $_REQUEST['user_id'] ) ? $_REQUEST['user_id'] : $_SESSION['user_id'];

$profile = juice_stand()->profile( $user_id );

?>
<div id="profile">
	<img src="<?php echo $profile['image'];?>" />
	<div>
		<h3><?php echo $profile['name'];?></h3>
		<a href="<?php echo $profile['url']; ?>" ><?php echo $profile['url']; ?></a><br/>
		<a href="mailto:<?php echo $profile['email']; ?>" ><?php echo $profile['email']; ?></a><br/>
		<a href="http://twitter.com/<?php echo $profile['twitter']; ?>" ><?php echo $profile['twitter']; ?></a><br/>
	</div>
</div>
<?php
require 'includes/footer.php';