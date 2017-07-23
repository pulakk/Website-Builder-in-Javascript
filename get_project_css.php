<?php
	if(isset($_POST['project'])){
		$project = $_POST['project'];
		if(file_exists('projects/'.$project)){
			$css_load_file = file('projects/'.$project.'/css/style.css');
			$css = "";
			foreach($css_load_file as $line){
				$css .= $line;
			}

			// split main.css from style.css
			$css = explode('main.css finishes here */',$css);
			echo $css[1];
		}else{
			$css_load_file = file('main/default_style.css');
			$css = "";
			foreach($css_load_file as $line){
				$css .= $line;
			}
			echo $css;
		}
	}
?>
