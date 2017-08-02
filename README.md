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
