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
 the count is set to be greater than 2*/
for($i = 2;$i<count($projects);$i++){
	echo '<button class="load-project">'.$projects[$i].'</button>';
}
echo '<br>';
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
