# Zinx-website-builder, Ongoing Project
## Login
The web platform needs an HTTP server for hosting the webpage. It loads at the url **index.php** which implements a simple form input asking the user to type in a project name.

![login image](https://github.com/OrionMonk/zinx-website-builder/blob/master/image_files/loginimage.png)

The html code for the form input is as follows. 

```html
<!-- html form -->
<form action="builder.php" method="post">
		<input id="project-name" type="text" name='folder-name' placeholder="Project Name"/>
		<button class='start-project' type="submit" value="submit">Start Project</button>
</form>
```
The php code shown below, implemented in **index.php** file itself, displays the current saved projects that the user has been working on, which are stored in *./projects/* folder.
```php
<?php

	$projects = scandir('projects/');
	
	/* scandir lists two extra lines '.' and '..' for each folder and hence 
	 the count is started from 2 instead of 0 */
	for($i = 2;$i<count($projects);$i++){
		echo '<button class="load-project">'.$projects[$i].'</button>';
	}
	
	echo '<br>';

?>
```

## The Zinx Editor
The editor has a variable that works as a css buffer for both classes styling and id styling, namely **css_classes** and **css_ids**. These store the current css styling of all the classes and ids created within the editor with it's tools.

```javascript

var css_classes = {};
var css_ids = {};

```

When a new project is created, the css buffer variables are loaded with default css templates which are loaded from **default_style.css** and **main.css** files stored in **main** folder.

```css
/* main.css */
html{
	min-height:100%;
}
body{
	min-height:100%;
	margin:0px;
	padding:0px;
}
div{
	box-sizing: border-box;
}
input{
	box-sizing: border-box;
}
textarea{
	box-sizing: border-box;
}
button{
	cursor:pointer;
	box-sizing: border-box;
}
```

```css
/* default_style.css */
.main-content-container{
	padding : 10px;
	text-align : center;
	font-family : raleway;
}
```
Any changes to the current css buffer variables are saved in the buffer storage file *main/style.css*, through the javascript function in *builder/builder.js* shown below, which sends an **ajax request** to *tmp_css.php* for the purpose. The stylesheet with id **stylesheet-styling** which is the main styling file of the page, is dynamically updated when the query is successful.

```javascript

// save css buffer object to current css editor settings buffer
function tmp_css_properties(){
	
	let link = 'tmp_css.php';
	css_string = "";
	
	// for all classes
	for(let each_class in css_classes){
		css_string += "."+each_class+'{\n';
		
		// for each class add save their properties
		for(let key in css_classes[each_class]){
			if(css_classes[each_class][key]!='')
				css_string += '\t'+key+' : '+css_classes[each_class][key]+';\n';
		}
		css_string += '}\n';
	}

	// for all ids 
	for(let each_id in css_ids){
		css_string += "#"+each_id+'{\n';
		
		// for each id add save their properties
		for(let key in css_ids[each_id]){
			if(css_ids[each_id][key]!='')
				css_string += '\t'+key+' : '+css_ids[each_id][key]+';\n';
		}
		css_string += '}\n';
	}
	
	// send save query through ajax to link ("tmp_css.php")
	$.ajax({url:link,data:"css="+css_string,type:'post',success:function(data){
		// reload style sheet when success in saving
		$('#stylesheet-styling').attr('href',$('#stylesheet-styling').attr('href')+"?id=" + new Date().getMilliseconds());
	}});
}
```

## Main Files

> ./builder/builder.js - The main editor code (600+ lines) - look at the code to better understand (properly commented, readable)

> ./builder.php - checks if logged in from index.php with a valid project name - if new project, then loads default html, else loads html file from project saved

> ./save.php - save query from temporary css file "./main/style.css" and "./main/main.css" to project folder's "css/styles.css"

> ./tmp_css.php - save query for css buffer file "./main/style.css" when client makes css changes

> ./get_project_css.php - loads saved project

## to-do
 - [x] class/id editor

 - [x] class/id editor 

 - [x] project manager (save/load)

 - [x] Color picker

 - [ ] background images
