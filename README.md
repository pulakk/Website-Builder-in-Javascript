# Zinx-website-builder (Ongoing Project)
##  App Walkthrough (Needs an HTTP Server supporting PHP)
The web site starts from the url **./index.php** which implements a simple form input
![login image](https://github.com/OrionMonk/zinx-website-builder/blob/master/image_files/loginimage.png)

```html
<!-- html form -->
<form action="builder.php" method="post">
		<input id="project-name" type="text" name='folder-name' placeholder="Project Name"/>
		<button class='start-project' type="submit" value="submit">Start Project</button>
</form>
```
A Javascript snippet given as follows, implemented in **./builder/index.js** displays the current saved projects that the user has been working on, which are stored in **./projects/** folder.
```javascript
window.onload = function(){
    $('.load-project').on('click',function(){
        $('#project-name').val($(this).html());
    });
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
