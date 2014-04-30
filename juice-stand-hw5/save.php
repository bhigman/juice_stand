<?php

require 'includes/functions.php';
require 'includes/juice-stand.php';

$result = juice_save_game( $_POST );

if ( TRUE !== $result )
{
	echo $result;
	exit;
}// end if

header( 'Location: game.php' );
exit;