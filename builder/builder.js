let current_div;
let prev_div;
let css_string = "";
let main_container = 'main-content-container';
let config_visible = true;
let default_styling = {
	'position' : '',
	'height' : '',
	'width':'',
	'background':'',
	'color':'',
	'padding':'',
	'margin':'',
	'text-align':'',
	'font-family':'',
	'font-size':'',
	'font-weight':'',
	'display':'',
	'border':'',
	'border-bottom':'',
	'border-left':'',
	'border-right':'',
	'border-top':'',
	'float':'',
	'clear':'',
	'transition':'',
	'box-shadow':'',
	'left':'',
	'right':'',
	'top':'',
	'bottom':'',
	'margin-left':'',
	'margin-right':'',
	'margin-top':'',
	'margin-bottom':'',
	'overflow':'',
	'overflow-x':'',
	'overflow-y':'',
	'z-index':'',
	'cursor':'',
	'padding-left':'',
	'padding-right':'',
	'padding-top':'',
	'padding-bottom':'',

};
var css_classes = {};
var css_ids = {};
let tabs = ['div#config-class','div#config-id','div#config-save'];
let colors = [['#fff','#ddd','#bbb','#888'],
 ['#fee','#fcc','#faa','#f88'],
['#efe','#cfc','#afa','#8f8'],
 ['#eef','#ccf','#aaf','#88f']];

window.onload = function(){
////////////////////////////////// DOM Initialisation //////////////////////////////

	// movable config container
	$('.config-container').draggable();
	$(".config-tabs-container").draggable();
	$('.config-tabs-container').draggable('disable');
	// $('.config-tabs-container').draggable(false);

	// movable save, class and id properties
	$('div#config-move-container').on('mousedown',function(){
		$('.config-tabs-container').draggable('enable');
	})
	$('div#config-move-container').on('mouseup',function(){
		$('.config-tabs-container').draggable('disable');
	})

	// load current css styling buffer from project css file
	$.ajax({
		url:'get_project_css.php',
		type:'post',
		data:'project='+$('span#config-project-name').html(),
		success:load_css_buffer});

	// tab click events
	$('div#config-class-tab').on("mouseup",function(){
		active_tab('div#config-class');
	});
	$('div#config-id-tab').on("mouseup",function(){
		active_tab('div#config-id');
	});
	$('div#config-save-tab').on("mouseup",function(){
		active_tab('div#config-save');
	});

	// css showcase height
	$('.config-css-show').css('max-height',($(window).height()-400)+'px');

	// window resize functions
	$(window).resize(function(){
		$('.config-css-show').css('max-height',($(window).height()-400)+'px');
		$('.config-tabs-container').css({'left':'0px','top':'0px'});
		$('.config-container').css({'right':'20px','top':'20px'})
	});

////////////////////////////////// PROPS functions //////////////////////////////
	// close properties box
	$('button#config-properties-close').on('mousedown',function(){
		$('div#config-properties').hide();
		current_div.css({'outline':'none'});
	});

	// on clicking any div get its properties
	$(document).on('click',':not(body,html)',get_description);

	// on changing class select -> change class of div
	$("select#div-class").on("change",function(){
		if(typeof current_div != "undefined")
			current_div.attr('class',$(this).val());
	});

	// remove div class
	$('button#div-remove-class').on('click',function(){
		if(typeof current_div != 'undefined'){
			current_div.removeAttr('class');
			$('select#div-class').val('');
		}
	});

	// on selecting div class show class properties in class and div tabs container
	$('select#div-class').on('change',function(){
		$('select#config-class-selected').val($(this).val());
			$('select#config-class-selected').trigger('change');
	});
	// and for id
	$('select#div-id').on('change',function(){
		$('select#config-id-selected').val($(this).val());
		$('select#config-id-selected').trigger('change');
	});

	// on changing id select element -> change id of div
	$("select#div-id").on("change",function(){
		if(typeof current_div != "undefined")
			current_div.attr('id',$(this).val());
	});

	// remove div id
	$('button#div-remove-id').on('click',function(){
		if(typeof current_div != 'undefined'){
			current_div.removeAttr('id');
			$('select#div-id').val('');
		}
	});

	// on changing html text of div -> update text area
	$('#div-html-text').on("keyup",function(){
		current_div.html($('textarea#div-html-text').val());
	});

	// on clicking -> add new div inside the actual div
	$('button#div-add-new').on('click',function(){
		let tmp = $('<div>(New Test Div)</div>');

		if(typeof current_div != "undefined"){
			current_div.append(tmp);
		}
		$('#div-html-text').val('');
	});

	// empty div inside when remove button clicked
	$('button#div-remove-children').on('click',function(){
		if(typeof current_div != "undefined"){
			current_div.empty();
		}
	});

////////////////////////////////// CLASS FUNCTIONS //////////////////////////////
	// background color icons
	$(document).on('click','.config-color-bg-class-css',function(){
		$('input#div-class-background').val($(this).attr('id').split('config-color-value-')[1]);
		$('input#div-class-background').trigger('change');
	})
	// text color icons
	$(document).on('click','.config-color-text-class-css',function(){
		$('input#div-class-color').val($(this).attr('id').split('config-color-value-')[1]);
		$('input#div-class-color').trigger('change');
	})

	// show css properties of class selected
	$('select#config-class-selected').on("change",get_class_css);

	// on clicking create new class
	$('button#config-create-class').on('click',create_class_css);

	// remove class
	$('button#config-remove-class').on('click',function(){
		delete css_classes[$('select#config-class-selected').val()];
		update_classes_list();
		get_class_css();
		tmp_css_properties();
	});

////////////////////////////////// ID FUNCTIONS //////////////////////////////
	// background color icons
	$(document).on('click','.config-color-bg-id-css',function(){
		$('input#div-id-background').val($(this).attr('id').split('config-color-value-')[1]);
		$('input#div-id-background').trigger('change');
	})
	// text color icons
	$(document).on('click','.config-color-text-id-css',function(){
		$('input#div-id-color').val($(this).attr('id').split('config-color-value-')[1]);
		$('input#div-id-color').trigger('change');
	})

	// show css properties of class selected
	$('select#config-id-selected').on("change",get_id_css);

	// on clicking create new class
	$('button#config-create-id').on('click',create_ids_css);

	// remove id
	$('button#config-remove-id').on('click',function(){
		delete css_ids[$('select#config-id-selected').val()];
		update_ids_list();
		get_id_css();
		tmp_css_properties();
	});

////////////////////////////////// SAVE FUNCTIONS //////////////////////////////
	// save page
	$('button#config-project-save').on("click",project_save);

	// new project
	$('button#config-project-new').on("click",function(){
		window.location.href = 'index.php';
	});

	$('button#config-project-url').on('click',function(){
		var win = window.open('projects/'+$('#config-project-name').html(), '_blank');
		if (win) win.focus();
		else alert('Please allow popups for this website');
	});
}

////////////////////////////////////////////////////////////////////////////
////////////////////////////// FUNCTIONS DECLARATIONS //////////////////////
////////////////////////////////////////////////////////////////////////////


function load_css_buffer(response){
	let uncommented = response.split(/\/\*[a-zA-Z\s]*\*\//);
	for(let i in uncommented){
		let snippet = uncommented[i];
		if(snippet.trim() != ''){
			let group = snippet.split('}');
			for(let i in group){
				let css_instance = group[i].trim();
				if(css_instance != ''){
					if(css_instance.startsWith('.')){
						css_instance = css_instance.split('.')[1];
						let className = css_instance.split('{')[0].trim();
						css_classes[className.toString()] = JSON.parse(JSON.stringify(default_styling));

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
	// update list of classes and ids
	update_classes_list();
	update_ids_list();
	get_class_css();
	get_id_css();

	// update css buffer
	tmp_css_properties();
}

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

// update active tab
function active_tab(tab){
	for(let i in tabs){
		if(tabs[i]!=tab)
			$(tabs[i]).hide();
		$(tabs[i]+'-tab').css({'border-radius':'25px'});
	}
	$(tab).toggle();
	if($(tab).css('display') != 'none'){
		$(tab+'-tab').css({'border-radius':'25px 25px 0px 0px'});
	}
}

// get div properties
function get_description(e){
	// show the div class and id and the html text inside it
	e.stopPropagation();

	if(!$(this).is('[class^="config"]')){
		$('div#config-properties').show();

		// store previous div and get currently selected div
		prev_div = current_div;
		current_div = $(this);

		// show current div css properties
		if(typeof current_div != 'undefined') {
			$('select#config-class-selected').val(current_div.attr('class'));
			get_class_css();

			$('select#config-id-selected').val(current_div.attr('id'));
			get_id_css();
		}

		// mark new div by highlighting through a blue outline
		if((typeof prev_div!='undefined')){
			prev_div.css('outline','none');
		}
		current_div.css('outline','2px dashed #ccf');

		// get class and html text properties of div
		let text = current_div.html();
		let className = current_div.attr("class");
		let idName = current_div.attr("id");

		// show class and html text properties
		$('textarea#div-html-text').val(text);
		$('select#div-class').val(className);
		$('select#div-id').val(idName);
	}
}

// create css class
function create_class_css(){
	// get class name to be created
	let className = $('input#config-new-class').val();
	if(className!= ""){
		// create new class key in css_classes object
		if(!css_classes.hasOwnProperty(className)){
			css_classes[className] = JSON.parse(JSON.stringify(default_styling));
		}
		// update select elements once new class is added
		update_classes_list();

		// select new class created
		$('select#config-class-selected').val(className);

		// show class css properties
		get_class_css();
	}
}

// create css id
function create_ids_css(){
	// get id name to be created
	let idName = $('input#config-new-id').val();
	if(idName!= ""){
		// create new id key in css_ids object
		if(!css_ids.hasOwnProperty(idName)){
			css_ids[idName] = JSON.parse(JSON.stringify(default_styling));
		}
		// update select elements once new id is added
		update_ids_list();

		// select create class
		$('select#config-id-selected').val(idName);

		// show id css properties
		get_id_css();
	}
}

//update class select elements
function update_classes_list(){
	// clean first
	$('select#div-class').empty();
	$('select#config-class-selected').empty();
	// add from css_classes object
	for(let key in css_classes){
		let tmp = $('<option></option').attr('value',key).text(key);// create node
		$('select#div-class').append(tmp);// append node

		tmp = $('<option></option').attr('value',key).text(key);// create node
		$('select#config-class-selected').append(tmp);// append node
	}
	// deselect div
	$('select#div-class').val('');
}

// update id select elements
function update_ids_list(){
	// clean first
	$('select#div-id').empty();
	$('select#config-id-selected').empty();
	// add from id_class object
	for(let key in css_ids){
		let tmp = $('<option></option').attr('value',key).text(key);// create node
		$('select#div-id').append(tmp);// append node

		tmp = $('<option></option').attr('value',key).text(key);// create node
		$('select#config-id-selected').append(tmp);// append node
	}
	// deselect id
	$('select#div-id').val('');
}

// get css details of class specified
function get_class_css(e, className){
	// get selected class
	if(typeof className == 'undefined') className = $('select#config-class-selected').val();

	// clean css showcase
	$('#config-class-css').empty();

	if(className!=null){
		// background color options
		$('#config-class-css').append('<h4 class="config-default">Class : '+className+'</h4>Background Color<br>');
		for(let i in colors){
			for(let j in colors[i])
				$('#config-class-css').append('<button class="config-color-icon-choice config-color-bg-class-css" style="background:'+colors[i][j]+';" id="config-color-value-'+colors[i][j]+'"></button>');
			$('#config-class-css').append('<br>');
		}
		// text color options
		$('#config-class-css').append('<br>Text Color<br>');
		for(let i in colors){
			for(let j in colors[i])
				$('#config-class-css').append('<button class="config-color-icon-choice config-color-text-class-css" style="background:'+colors[i][j]+';" id="config-color-value-'+colors[i][j]+'"></button>');
			$('#config-class-css').append('<br>');
		}

		// for every class in css_classes
		for(let key in css_classes[className]){
			// creating nodes
			let tmp = $('<div class="config-item"></div>');
			let tmp_attr = $('<div class="config-attribute">'+key+'</div>');
			let tmp_inp = $('<input class="config" id="div-class-'+key+'" type="text" spellcheck="false"/>');

			// click event for input change
			tmp_inp.val(css_classes[className][key]);
			tmp_inp.on('change',function(){
				// on changing styling update css_classes object
				css_classes[$('select#config-class-selected').val()][$(this).attr('id').split("div-class-").join('')] = $(this).val();
				// update server css file
				tmp_css_properties();

			});

			// appending everything to showcase css of class
			let tmp_val = $('<div class="config-value">');
			tmp_val.append(tmp_inp);
			tmp_val.append('</div>');
			tmp.append(tmp_attr);
			tmp.append(tmp_val);
			$('#config-class-css').append(tmp);
		}
	}
}

// get css details of id specified
function get_id_css(e,idName){
	// get selected id
	if(typeof idName=='undefined') idName = $('select#config-id-selected').val();

	// clean first
	$('#config-id-css').empty();
	if(idName != null){
		// background color options
		$('#config-id-css').append('<h4 class="config-default">Id : '+idName+'</h4><br>Background Color<br>');
		for(let i in colors){
			for(let j in colors[i])
				$('#config-id-css').append('<button class="config-color-icon-choice config-color-bg-id-css" style="background:'+colors[i][j]+';" id="config-color-value-'+colors[i][j]+'"></button>');
			$('#config-id-css').append('<br>');
		}
		// text color options
		$('#config-id-css').append('<br>Text Color<br>');
		for(let i in colors){
			for(let j in colors[i])
				$('#config-id-css').append('<button class="config-color-icon-choice config-color-text-id-css" style="background:'+colors[i][j]+';" id="config-color-value-'+colors[i][j]+'"></button>');
			$('#config-id-css').append('<br>');
		}

		// for every id in css_ids
		for(let key in css_ids[idName]){
			// creating nodes
			let tmp = $('<div class="config-item"></div>');
			let tmp_attr = $('<div class="config-attribute">'+key+'</div>');
			let tmp_inp = $('<input class="config" id="div-id-'+key+'" type="text" spellcheck="false"/>');

			// click event for input change
			tmp_inp.val(css_ids[idName][key]);
			tmp_inp.on('change',function(){
				// on changing styling update css_ids object
				css_ids[$('select#config-id-selected').val()][$(this).attr('id').split("div-id-").join('')] = $(this).val();
				// save css file to serer
				tmp_css_properties();
			});

			// appending everything to show css of id
			let tmp_val = $('<div class="config-value">');
			tmp_val.append(tmp_inp);
			tmp_val.append('</div>');
			tmp.append(tmp_attr);
			tmp.append(tmp_val);
			$('#config-id-css').append(tmp);
		}
	}
}

// save css file to server
function tmp_css_properties(){
	let link = 'tmp_css.php';
	css_string = "";
	for(let each_class in css_classes){
		css_string += "."+each_class+'{\n';
		for(let key in css_classes[each_class]){
			if(css_classes[each_class][key]!='')
				css_string += '\t'+key+' : '+css_classes[each_class][key]+';\n';
		}
		css_string += '}\n';
	}

	for(let each_id in css_ids){
		css_string += "#"+each_id+'{\n';
		for(let key in css_ids[each_id]){
			if(css_ids[each_id][key]!='')
				css_string += '\t'+key+' : '+css_ids[each_id][key]+';\n';
		}
		css_string += '}\n';
	}
	$.ajax({url:link,data:"css="+css_string,type:'post',success:function(data){
		$('#stylesheet-styling').attr('href',$('#stylesheet-styling').attr('href')+"?id=" + new Date().getMilliseconds());
	}});
}
