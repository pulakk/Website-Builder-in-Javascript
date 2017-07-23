<?php
	if(isset($_POST['css'])){
		$myfile = fopen("main/style.css","w");
		fwrite($myfile,$_POST['css']);
		fclose($myfile);
		echo "CSS Buffer updated.";
	}
?>
