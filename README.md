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
## Understanding the Editor Tools

![editor view](https://github.com/OrionMonk/zinx-website-builder/blob/master/image_files/editor.png)


## Saving and Loading CSS styling
### Loading
The editor has a variable that works as a css buffer for both classes styling and id styling, namely **css_classes** and **css_ids**. These store the current css styling of all the classes and ids created within the editor with it's tools.

```javascript

var css_classes = {};
var css_ids = {};

```

When we reach the project page, the following javascript code implemented in *builder/builder.js* sends a query to *get_project_css.php* for the required css styling to be loaded into the page.
```javascript
$.ajax({
		url:'get_project_css.php',
		type:'post',
		data:'project='+$('span#config-project-name').html(),
		success:load_css_buffer});
```

The script *get_project_css.php* either returns a default css template, from *main/default_style.css* and *main/main.css*, or a saved css styling from the project's css folder, based on whether it is a new project or a saved project to be loaded respectively. The code is as shown below: 
```php
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

```


Based on the reponse from the php script, the editor then loads the css styling into the css buffer variables, namely **css_classes** and **css_ids**, through the following javasript code implemented in *builder/builder.js*:

```javascript
// loads css styling from the project file to css buffer file of editor page
function load_css_buffer(response){
	// split all uncommented segments of code
	let uncommented = response.split(/\/\*[a-zA-Z\s]*\*\//);
	for(let i in uncommented){
		// for all snippets of uncommented code
		let snippet = uncommented[i];
		
		// if snippet not empty
		if(snippet.trim() != ''){
			// as each class and id styling are separated by [.#][a-zA-Z]*{ ... } so split it by '}'	
			let group = snippet.split('}');
			
			for(let i in group){
				let css_instance = group[i].trim(); // for each styling group (class or id) spaces trimmed at the end
				if(css_instance != ''){ // if split item is not empty
					
					if(css_instance.startsWith('.')){ // if starts with '.' then it is a class
						css_instance = css_instance.split('.')[1];
						let className = css_instance.split('{')[0].trim();
						
						// set new class for each className in styling file loaded
						css_classes[className.toString()] = JSON.parse(JSON.stringify(default_styling));

						// add each css property eg. padding:100px; separate by ';' and then add each property
						let css_props = group[i].split('{')[1].split(';');
						
						for(let i in css_props){
							let css_prop = css_props[i].trim();
							if(css_prop!=''){
								let key = css_prop.split(':')[0].trim();
								let value = css_prop.split(':')[1].trim();
								css_classes[className.toString()][key.toString()] = value.toString();
							}
						}
					}
					// same logic for id which start with '#'
					else if(css_instance.startsWith('#')){
						css_instance = css_instance.split('#')[1];
						let idName = css_instance.split('{')[0].trim();
						css_ids[idName.toString()] = JSON.parse(JSON.stringify(default_styling));

						let css_props = group[i].split('{')[1].split(';');
						for(let i in css_props){
							let css_prop = css_props[i].trim();
							if(css_prop!=''){
								let key = css_prop.split(':')[0].trim();
								let value = css_prop.split(':')[1].trim();
								css_ids[idName.toString()][key.toString()] = value.toString();
							}
						}
					}
				}
			}
		}
	}

```

### Saving

Any changes to the current css buffer variables are saved in the buffer storage file *main/style.css*, through the javascript function in *builder/builder.js* shown below, which sends an **ajax request** to *tmp_css.php* for the purpose. The stylesheet with id **stylesheet-styling** which is the main styling file of the page, is dynamically updated when a save query is successful. The save query is also sent to the server whenever a project is loaded or created.

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

The *tmp_css.php* server script then saves the css styling it recieves from the client into the temporary css file the editor is currently working on - *main/style.css*.
```php
<?php
	if(isset($_POST['css'])){
		// writing to temporary css buffer file
		$myfile = fopen("main/style.css","w");
		fwrite($myfile,$_POST['css']);
		fclose($myfile);
		echo "CSS Buffer updated.";
	}
?>
```
## Saving the Project

To save the project, we basically need to save the html inside the edited part of the page and the css styling of the page (separate from the styling of the editor tools). This is achieved by an ajax query to a php script named *save.php*, with the html of the edited page and a css string, which stores the current styling of the page formatted in css using the css buffer variables.

```javascript
// save the current html file and css styling to project file by sending ajax query to ./save.php
function project_save(){
	if(typeof current_div != 'undefined') current_div.css('outline','none');
	let link = 'save.php';
	let html = '<!DOCTYPE html>\n'+
	'<html>\n'+
	'<head>\n'+
		'\t<!-- local links -->\n'+
		'\t<link rel="stylesheet" href="css/style.css">\n\n'+
		'\t<!-- online links -->\n'+
		'\t<link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Raleway"/>\n\n'+
		'\t<title> '+$('span#config-project-name').html()+'</title>\n'+
	'</head>\n'+
	'<body>\n'+
	'\t<div class="'+main_container+'">\n'+
	'\t\t'+$('div.'+main_container).html()+'\n'+
	'\t</div>\n'+
	'</body>\n'+
	'</html>\n';

	$.ajax({
		url:link,
		data:'project-name='+$('span#config-project-name').html()+'&html='+html+'&css='+css_string,
		type:'post',
		success:function(response){
			console.log(response);
		}
	});
}
```

The php script *save.php* then creates a folder with the desired project name, if it doesn't already exist, and then creates or updates the html and css files inside it. These files are later used to load saved projects. 

```php
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
```

When there is a load project operation, the html of the project saved is loaded into the editor with the following script in *builder.php*:

```php
<?php
		// if project already exists load the html
		if(file_exists('projects/'.$_POST['folder-name'])){
			$html_load_file = file('projects/'.$_POST['folder-name'].'/index.html');
			$html ="";
			foreach($html_load_file as $line){
				$html .= $line;
			}
			echo trim(explode('</body>',trim(explode('<body>',$html)[1],' '))[0],' ');
		}else{
			// output html
			echo '<div class="main-content-container"><div>Welcome</div><div>Sample Div</div></div>';
		}
?>
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
