<div class="screen">
	<button id="save">Save</button><br/>
	<button id="reset">Reset</button><br/>
	<button id="logout">Logout</button><br/>
</div>

<form method="post" action="save.php" id="save_form" style="display:none;">
	<input type="text" name="name" id="form_name" />
	<input type="text" name="balance" id="form_balance" />
	<input type="text" name="price" id="form_price" />
	<input type="text" name="customers" id="form_customers" />
	<input type="text" name="date" id="form_date" />
	<input type="text" name="juice" id="form_juice" />
	<input type="text" name="fruit" id="form_fruit" />
	<input type="text" name="time" id="form_time" />
</form>

<form method="get" action="index.php" id="logout-form" style="display: none;">
	<input name="logout" id="set_logout" />
</form>