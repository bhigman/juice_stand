<?php
require 'includes/juice-stand.php';
$result = juice_save_game( $_POST );

if ( TRUE !== $result && ! $GLOBALS['offline'] )
{
	echo $result;
	exit;
}// end if

header( 'Location: game.php' );
exit;