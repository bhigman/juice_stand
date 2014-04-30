<html>
	<head></head>
	<body>
		<form class="screen">
			<button id="saveButton" type="button">Save</button>
			<button id="resetButton" type="button">Reset</button>
		</form>
		<form id="hiddenForm" action="save.php" method="post" hidden="hidden">
			<fieldset>
				<input id="subId" name="subId" />
				<input id="subName" name="subName" />
				<input id="subBalance" name="subBalance" />
				<input id="subPrice" name="subPrice" />
				<input id="subDate" name="subDate" />
				<input id="subTime" name="subTime" />
				<input id="subFruit" name="subFruit" />
				<input id="subJuice" name="subJuice" />
				<input id="subCust" name="subCust" />
			</fieldset>
		</form>
	</body>
</html>