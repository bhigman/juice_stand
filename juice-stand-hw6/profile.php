<?php
// @TOOD: homework #6 - new profile page!
require 'includes/juice-stand.php';
require 'includes/header.php';
juice_profile();
?>
<div id="profile">
	<?php echo '<img src="http://www.gravatar.com/avatar/'. md5( strtolower( trim($_POST['email']))) . '.jpg" />'; ?>
	<h3 id="user_name"><?= $_POST['name'] ?></h3>
	<a id="webpage" href="<?= $_POST['url'] ?>"><?= $_POST['url'] ?></a><br/>
	<a id="email" href=""><?= $_POST['email'] ?></a></br>
	<a id="twitter" href="http://twitter.com/<?= $_POST['twitter']?>">@<?= $_POST['twitter'] ?></a>
</div>
<?php
	require 'includes/footer.php';
	//echo '<pre>';
	//print_r($_SERVER);
?>