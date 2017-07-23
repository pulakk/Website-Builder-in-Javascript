<?php
	if(isset($_POST['project-name'])){
		// create folder if not present
		$folder = 'projects/';
		$folder .= $_POST['project-name'];
		if (!file_exists($folder)) {
			mkdir($folder, 0777, true);
			mkdir($folder.'/css', 0777, true);
		}

		// save css file
		$main_css = file('main/main.css');
		$default_css = "";
		foreach($main_css as $line){
			$default_css .= $line;
		}
		$style_css = fopen($folder."/css/style.css","w");
		fwrite( $style_css, $default_css . $_POST['css']);
		fclose($style_css);

		// save html file
		$html = fopen($folder.'/index.html','w');
		fwrite($html, $_POST['html']);
		fclose($html);
	}else{
		echo "Error Occured!";
	}
?>
