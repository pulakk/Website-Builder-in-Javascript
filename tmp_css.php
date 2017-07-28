<?php
	if(isset($_POST['css'])){
		// writing to temporary css buffer file
		$myfile = fopen("main/style.css","w");
		fwrite($myfile,$_POST['css']);
		fclose($myfile);
		echo "CSS Buffer updated.";
	}
?>
