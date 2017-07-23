<html>
<head>
	<!-- offline links -->
	<link rel='stylesheet' href='builder/index.css?<?php echo date('l jS \of F Y h:i:s A'); ?>'>
	<script type='text/javascript' src='builder/index.js?<?php echo date('l jS \of F Y h:i:s A'); ?>'></script>

	<!-- online links -->
	<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Raleway"/>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

	<title> Zinx | Log in </title>
</head>
<body>
	<div style="height:14%;"></div>
	<h1>Zinx CSS Editor <span style="color:#eee">(beta)</span></h1><br>
	<form action="builder.php" method="post">
		<input id="project-name" type="text" name='folder-name' placeholder="Project Name"/>
		<button class='start-project' type="submit" value="submit">Start Project</button>
	</form>
	<div style="color:#888;text-align:center;padding:10px;margin-top:20px;">
	<?php
		$projects = scandir('projects/');
		if(count($projects)>2) echo 'Projects you have been working on <hr border="none" color="#eee" size="1" width="300">';
		for($i = 2;$i<count($projects);$i++){
			echo '<button class="load-project">'.$projects[$i].'</button>';
		}
		echo '<br>';
	?></div>
	<div class="description">
		<span style="color:#333">Zinx</span> css editor is a free online platform to build and develop css classes and ids of pages in an instant.
		The focus of the project is <span style="color:#333">faster web page development</span>.
		It supports css class and id creation, dynamic css styling update for each class/id property changed and clickable div property edit.<br><br>
		<b>To <span style="color:#333">start a new project</span>, fill in a project name and cilck on start new project.</b>
	</div>
</body>
</html>
