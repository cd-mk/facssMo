

function tmpl_html(tmpl_id, data) {
	var html = $('#'+tmpl_id).html();
	for(var n in data) {
		html = replace_tmpl_var(html,n,data[n]);
	}
	return html;
}


function replace_tmpl_var(org,name,value) {
	try {
		return org.replace(new RegExp('\\$\\{'+name+'\\}', 'g'), value);
	}
	catch(e) {
		return null;
	}
}


function render_html(div_id, tmpl_id, data) {
	$('#'+div_id).html( tmpl_html(tmpl_id, data) );
}


function render_table(div_id, table_id, row_id, data) {
	$('#'+div_id).html( tmpl_html(tmpl_id, data[0]) );
	for(var n in data) {
		$('#'+div_id+' > table > tbody').append( tmpl_html(tmpl_id, data[n]) );
	}
}


//	200627 FORM을 OBJ로 반환
function make_form2obj(oid) {

    var O = new Object();

	var INPUT = $('#'+oid).find('INPUT');
	for(var n=0; n< INPUT.length; n++) {
		var obj_name = $(INPUT[n]).attr('name');
		var obj_id = $(INPUT[n]).attr('id');
		if (obj_name==undefined && obj_id==undefined) continue;
		var key = (obj_id != undefined) ? obj_id : obj_name;
		O[key] = $(INPUT[n]).val();
	}

	var SELECT = $('#'+oid).find('SELECT');
	for(var n=0; n< SELECT.length; n++) {
		var obj_name = $(SELECT[n]).attr('name');
		var obj_id = $(SELECT[n]).attr('id');
		if (obj_name==undefined && obj_id==undefined) continue;
		var key = (obj_id != undefined) ? obj_id : obj_name;
		O[key] = $(SELECT[n]).val();
	}

	var TEXTAREA = $('#'+oid).find('TEXTAREA');
	for(var n=0; n< TEXTAREA.length; n++) {
		var obj_name = $(TEXTAREA[n]).attr('name');
		var obj_id = $(TEXTAREA[n]).attr('id');
		if (obj_name==undefined && obj_id==undefined) continue;
		var key = (obj_id != undefined) ? obj_id : obj_name;
		O[key] = $(TEXTAREA[n]).val();
	}

	return O;
}


//	200822
function body_post(url, param) {
	$.ajax({
		method:'POST',
        contentType: 'application/json; charset=utf-8',
		url: url,
		data: JSON.stringify(param),
		success: function(data) {
			$('body').append(data);
		},
		error: function(jqXHR, textStatus) {
			alert(jqXHR.status+' '+jqXHR.statusText);
		}
	});
	
}	

//	200629 json_post
function json_post(url, param, succ) {
	$.ajax({
		method:'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
		url: url,
		data: JSON.stringify(param),
		success: succ,
		error: function(jqXHR, textStatus) {
			alert(jqXHR.status+' '+jqXHR.statusText);
		}
	});
	
}	


//	200731 json_post2
function json_post2(url, param, succ, err) {
	$.ajax({
		method:'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
		url: url,
		data: JSON.stringify(param),
		success: succ,
		error: err
	});
	
}	


/*

	jQuery.fn.center = function () {
		this.css("position","absolute");
		this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
													$(window).scrollTop()) + "px");
		this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
													$(window).scrollLeft()) + "px");
		return this;
	}

*/
