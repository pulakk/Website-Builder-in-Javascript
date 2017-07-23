<!DOCTYPE html>
<html>
<head>
	<!-- local links -->
	<link rel="stylesheet" href="builder/builder.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
	<script type="text/javascript" src="builder/builder.js?<?php echo date('l jS \of F Y h:i:s A'); ?>"></script>
	<link rel="stylesheet" href="main/main.css?<?php echo date('l jS \of F Y h:i:s A'); ?>">
	<link rel="stylesheet" id="stylesheet-styling" href="main/style.css">

	<!-- online links -->
	<link rel="stylesheet" href="bootstrap-glyph/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Raleway"/>

	<title> Zinx | Website Builder</title>

</head>

<body>
<!-- editor -->
<div class="config-container" id="config-properties">
	<!-- navigator bar of config container -->
	<div class="config-bar">
		<span class='config-default glyphicon glyphicon-cog' style='font-size:14px;'></span>
		<button class='config-close-button' id='config-properties-close'>x</button>
	</div>

	<!-- html texts and class names and id of div -->
	<div class="config-edits">
		<!-- text inside -->
		<div class="config-item">
			<textarea class="config-input" id="div-html-text" spellcheck="false"></textarea>
		</div>

		<!-- class -->
		<div class="config-item">
			<div class="config-attribute">Class</div>
			<div class="config-value">
				<button class="config-button" id="div-remove-class">-</button>
			</div>
			<div class="config-value">
				<select class="config-select" id="div-class">
				</select>
			</div>
		</div>

		<!-- id -->
		<div class="config-item">
			<div class="config-attribute">ID</div>
			<div class="config-value">
				<button class="config-button" id="div-remove-id">-</button>
			</div>
			<div class="config-value">
				<select class="config-select" id="div-id">
				</select>
			</div>
		</div>

		<!-- add new element -->
		<div class="config-item">
			<div class="config-attribute">Add/Delete Div</div>
			<div class="config-value"><button class="config-button" id="div-add-new">+</button> <button class='config-button' id="div-remove-children">-</button></div>
		</div>
	</div>

</div>
<!-- tabs -->
<div class='config-tabs-container'>
	<!-- CLASS TAB -->
	<div class='config-default' id="config-class-container">
		<div class="config-tab" id="config-class-tab"><span class='config-default glyphicon glyphicon-tag'></span></div>

		<div class="config-edits" id="config-class">
			<div class="config-item">
				<div class="config-attribute">
					New Class
				</div>
				<div class="config-value">
					<button class="config-button" id="config-create-class">+</button>
				</div>
				<div class="config-value">
					<input class="config-default" id="config-new-class" type='text'/>
				</div>
			</div>
			<div class="config-item">
				<div class="config-attribute">
					Class
				</div>
				<div class="config-value">
					<button class="config-button" id="config-remove-class">-</button>
				</div>
				<div class="config-value">
					<select class="config-select" id="config-class-selected"></select>
				</div>
			</div>
				<br>
			<div class="config-css-show" id="config-class-css"></div>
		</div>
	</div>

	<!-- ID TAB -->
	<div class='config-default' id="config-id-container">
		<div class="config-tab" id="config-id-tab"><span class="config-default glyphicon glyphicon-tags"></span></div>
		<div class="config-edits" id="config-id">
			<div class="config-item">
				<div class="config-attribute">
					New ID
				</div>
				<div class="config-value">
					<button class="config-button" id="config-create-id">+</button>
				</div>
				<div class="config-value">
					<input class="config-default" id="config-new-id" type='text'/>
				</div>
			</div>

			<div class="config-item">
				<div class="config-attribute">
					Id
				</div>
				<div class="config-value">
					<button class="config-button" id="config-remove-id">-</button>
				</div>
				<div class="config-value">
					<select class="config-select" id="config-id-selected"></select>
				</div>
			</div>
			<br>
			<div class="config-css-show" id="config-id-css"></div>
		</div>
	</div>

	<!-- SAVE TAB -->
	<div class='config-default' id="config-save-container">
		<div class="config-tab" id="config-save-tab"><span class='config-default glyphicon glyphicon-file'></span></div>
		<div class="config-edits" id="config-save">
			Project -
			<span id="config-project-name" style="color:black;padding:10px;font-size:16px;border-bottom:2px solid #aaf;"><?php
				if(isset($_POST['folder-name'])){
					echo $_POST['folder-name'];
				} else {
					header('Location: index.php');
				}
			?></span><br><br>
			<div class = "config-item">
				<div class="config-default">
					<button class="config-button-large" id="config-project-save">Save Project&nbsp;&nbsp;<span class='config-default glyphicon glyphicon-save-file'></span></button>
				</div>
				<div class="config-default">
					<button class="config-button-large" id="config-project-new">New Project&nbsp;&nbsp;<span class='config-default glyphicon glyphicon-level-up'></span></button>
				</div>
				<div class="config-default">
					<button class="config-button-large" id="config-project-url" style=""><span style="color:#888;font-weight:bold;" class='config-default glyphicon glyphicon-folder-open'></span><br> Project Url <span class='config-default' style="color:#bbf">is</span> projects/<?php echo $_POST['folder-name']; ?></button>
				</div>
			</div>
		</div>
	</div>
</div>
<!-- Sample div -->
<?php
		// if project already exists load the html
		if(file_exists('projects/'.$_POST['folder-name'])){
			$html_load_file = file('projects/'.$_POST['folder-name'].'/index.html');
			$html ="";
			foreach($html_load_file as $line){
				$html .= $line;
			}
			echo explode('</body>',explode('<body>',$html)[1])[0];
		}else{
			// output html
			echo '<div class="main-content-container"><h2>Welcome</h2><div>Sample Div</div></div>';
		}
?>

</body>
</html>
