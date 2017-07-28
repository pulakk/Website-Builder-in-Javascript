# zinx-website-builder (beta)
Needs an http server to host the platform (preferrably apache xampp)

# Main Files->

> ./builder/builder.js - The main editor code (600+ lines) - look at the code to better understand (properly commented, readable)

> ./builder.php - checks if logged in from index.php with a valid project name - if new project, then loads default html, else loads html file from project saved

> ./save.php - save query from temporary css file "./main/style.css" and "./main/main.css" to project folder's "css/styles.css"

> ./tmp_css.php - save query for css buffer file "./main/style.css" when client makes css changes

> ./get_project_css.php - loads saved project

# to-do
> - [x] class/id editor

> - [x] class/id editor 

> - [x] project manager (save/load)

> - [x] Color picker

> - [ ] background images
