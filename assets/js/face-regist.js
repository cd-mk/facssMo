
var FD;

var det_sel=-1;
var face_arr=[];
var det_arr=[];
var det_cnt=0;

var conf = {tmr:null, tmr1:100, tmr2:1000};
var sts  = {cam_yn:false, sel_yn:false, reg_yn:false, ver_yn:false, verifying:false};

document.addEventListener("DOMContentLoaded", function() {

	//	하단 버튼
//	$('.card-footer button').attr('disabled', true);

	// 사진 선택 표시
	$('.choice-photo .col').on('click', function(){
		det_sel = $(this).attr('num');
		if (face_arr[det_sel]==undefined) return;

		$('.choice-photo .col.selected').removeClass('selected');
		$(this).addClass('selected');

		status_change('sel_yn', true);
	});


});


var guide480 = document.createElement("img");
guide480.setAttribute('src', 'face_outline_480.png');

var guide640 = document.createElement("img");
guide640.setAttribute('src', 'face_outline_640.png');


function detect_resize() {

	var off=$("#cam_img").offset();
	off.top = Math.round(off.top);
	off.left = Math.round(off.left);
	off.width = $("#cam_img").width();
	off.height = $("#cam_img").height();


	//	cam-image
	document.getElementById("cam_img").style.zIndex='0';
	// document.getElementById("cam_img").style.width=off.width+'px';
	// document.getElementById("cam_img").style.height=off.height+'px';

	//	div_status_box
	document.getElementById("div_status_box").style.position='absolute';
	document.getElementById("div_status_box").style.display='';
	// document.getElementById("div_status_box").style.zIndex='1';
	//document.getElementById("div_status_box").style.top=off.top+'px';
	//document.getElementById("div_status_box").style.left=off.left+'px';
	// 2020.09.04 추가
	document.getElementById("div_status_box").style.opacity ='1';

	document.getElementById("div_status_box").style.width=off.width+'px';
	document.getElementById("div_status_box").style.height=off.height+'px';

	//	카메라사용시에만 resize
	if (count321s > 0 && !sts.cam_yn) return;

	//	video
	document.getElementById("vid_camera").style.position='absolute';
	document.getElementById("vid_camera").style.display='';
	document.getElementById("vid_camera").style.zIndex='2';
	//document.getElementById("vid_camera").style.top=off.top+'px';
	//document.getElementById("vid_camera").style.left=off.left+'px';

	document.getElementById("vid_camera").style.width=off.width+'px';
	document.getElementById("vid_camera").style.height=off.height+'px';
	document.getElementById("vid_camera").setAttribute('width', off.width);
	document.getElementById("vid_camera").setAttribute('height', off.height);


	//	얼굴 guide
	var off2 = $("#vid_camera").offset();
	document.getElementById("cvs_guide").style.position='absolute';
	document.getElementById("cvs_guide").style.display='';
	document.getElementById("cvs_guide").style.opacity='.25';
	document.getElementById("cvs_guide").style.zIndex='3';
	//document.getElementById("cvs_guide").style.top=off2.top+'px';
	//document.getElementById("cvs_guide").style.left=off2.left+'px';

	document.getElementById("cvs_guide").style.width=$("#vid_camera").width()+'px';
	document.getElementById("cvs_guide").style.height=$("#vid_camera").height()+'px';
	document.getElementById("cvs_guide").setAttribute('width', $("#vid_camera").width());
	document.getElementById("cvs_guide").setAttribute('height', $("#vid_camera").height());


	if ($("#vid_camera").width() > $("#vid_camera").height()) {
		document.getElementById('cvs_guide').getContext('2d').drawImage(guide640,0,0,$("#vid_camera").width(),$("#vid_camera").height());
	}
	else {
		document.getElementById('cvs_guide').getContext('2d').drawImage(guide480,0,0,$("#vid_camera").width(),$("#vid_camera").height());
	}

	//	얼굴표시 0
	// var off2 = $("#vid_camera").offset();
	document.getElementById("cvs_output").style.position='absolute';
	document.getElementById("cvs_output").style.display='';
	document.getElementById("cvs_output").style.zIndex='4';
	//document.getElementById("cvs_output").style.top=off2.top+'px';
	//document.getElementById("cvs_output").style.left=off2.left+'px';

	document.getElementById("cvs_output").style.width=$("#vid_camera").width()+'px';
	document.getElementById("cvs_output").style.height=$("#vid_camera").height()+'px';
	document.getElementById("cvs_output").setAttribute('width', $("#vid_camera").width());
	document.getElementById("cvs_output").setAttribute('height', $("#vid_camera").height());

};




function status_change(name,value) {
	sts[name] = value;

	if (sts.cam_yn) {
		$('#btn1').attr('disabled', true).addClass('blur');
	}
	else {
		$('#btn1').attr('disabled', false).removeClass('blur');
	}

	if (!sts.sel_yn) {
		$('#btn2').attr('disabled', true).addClass('blur');
	}
	else {
		$('#btn2').attr('disabled', false).removeClass('blur');
	}


	if (sts.reg_yn) {
		$('#btn1').attr('disabled', true).addClass('blur');
		$('#btn2').attr('disabled', true).addClass('blur');
	}

}


function div_sts_box(s1,s2) {
	$('#div_status_box .text-status').text( s1 );
	$('#div_status_box .text-count').text( s2 );
	hide_camera();
}


function show_camera() {
	window.scrollTo(0,0);
	detect_resize();
	$('#div_status_box').hide();
	$('#vid_camera').show();
	$('#cvs_output').show();

}


function hide_camera() {
	detect_resize();
	$('#div_status_box').show();
	$('#vid_camera').hide();
	$('#cvs_guide').hide();
	$('#cvs_output').hide();
}


var count321s=3;
function count321() {

	div_sts_box('카메라를 준비 중입니다.',count321s);
	$('#div_status_box .inner2').removeClass('invisible');	//	200828

	if (count321s==0) {

		$('#div_status_box').hide();
		$('#div_status_box .inner2').addClass('invisible');	//	200828
		$('#vid_camera').show();
		$('#cvs_output').show();

		status_change('cam_yn', true);
		detect_resize();
		detect_face();

		return;
	}

	count321s--;
	conf.tmr = setTimeout(' count321(); ', 1000);
}

function count3210() {

	div_sts_box('카메라를 준비 중입니다.',count321s);
	$('#div_status_box .inner2').removeClass('invisible');	//	200828

	if (count321s==0) {
		$('#div_status_box').hide();
		$('#div_status_box .inner2').addClass('invisible');	//	200828
		$('#vid_camera').show();
		$('#cvs_output').show();

		status_change('cam_yn', true);
		detect_resize();
		detect_face2();

		return;
	}

	count321s--;
	conf.tmr = setTimeout(' count3210(); ', 1000);
}


//	210322 디자인변경으로 인한 추가
//	210323 complete add 추가
function show_step(n) {
	$('.step-guide-inner').removeClass('active').addClass('disabled');
	for(var i=0; i<n; i++) {
		$('.step-guide-inner:eq('+i+')').removeClass('disabled').addClass('complete');
	}
	$('.step-guide-inner:eq('+n+')').removeClass('disabled').addClass('active');
}


function back_main() {

	//	210322 디자인변경으로 인한 추가
	show_step(1);

	$('#div_modal').remove();
	$('.modal-backdrop').remove();

	if (!sts.reg_yn && !sts.ver_yn && confirm('얼굴 등록/확인이 완료되지 않았습니다. 화면을 이동합니까?')) {
		window.location.href=COMPLETE_URL2;
		return true;
	}

	if(!sts.ver_yn && confirm('얼굴 확인이 완료되지 않았습니다. 화면을 이동합니까?')) {
		window.location.href=COMPLETE_URL2;
		return true;
	}

	if (sts.reg_yn && sts.ver_yn) {
		window.location.href=COMPLETE_URL;
		return true;
	}

	return false;
}



function load_camera(func) {

	div_sts_box('카메라를 준비 중입니다.','');
	$('#div_modal').remove();
	$('.modal-backdrop').remove();

	status_change('cam_yn', false);
	jsFD.load_camera( document.getElementById('vid_camera'), func);

}


function stop_camera(msg) {

	clearTimeout(conf.tmr);

	div_sts_box(msg,'');
	hide_camera();

	status_change('cam_yn', false);
	jsFD.stop_camera( document.getElementById('vid_camera') );

}


function detect_init() {

	const img_blank='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

	jsFD.set_video(document.getElementById('vid_camera'));

	$('.choice-photo img').attr('src', img_blank);
	$('.choice-photo .col.selected').removeClass('selected');
	status_change('sel_yn', false);

	$('p.guide-box').html('<br/>');

	det_sel=-1;
	det_arr=[];
	det_cnt=0;

	count321s=3;
	count321();

};


function img_face_viewport(img, face) {

	// var nw = $(img).prop('naturalWidth');
	// var nh = $(img).prop('naturalHeight');
	var nw = jsFD.config.width;
	var nh = jsFD.config.height;

	var vw = $(img).parent().width();
	var vh = $(img).parent().height();

	//	CSS 보완
	$(img).parent().parent().css({overflow:'hidden', height:vh+'px'});

// console.log(vw,vh);

	try {
		var rw = face[2]/vw;	//	얼굴폭 400, ratio=2.xxx
		var rh = face[2]/vh;

		//	new width, x, y
		var new_w = Math.floor(nw / rw);
		var new_h = Math.floor(nh / rh);

		var face_x = face[0] / rw;
		var face_y = face[1] / rh;
		var ml = 0-Math.floor(face_x);
		var mt = 0-Math.floor(face_y);

		$(img).css({width:new_w+'px', height:new_h+'px', 'margin-left':ml+'px', 'margin-top':mt+'px'});

// console.log('CROP', new_w,new_h,ml,mt);
// console.log('CROP', face);

	}
	catch(e) {
		var rw = vw/nw;
		var rh = vh/nh;

		var new_w = Math.floor(nw * rw);
		var new_h = Math.floor(nh * rw);

		$(img).css({width:new_w+'px', height:new_h+'px', 'margin-left':0, 'margin-top':0});

// console.log('ALL', new_w,new_h,0,0);
// console.log('ALL', face);
	}


}


function detect_face() {

	if (!sts.cam_yn) return;


	var dets = jsFD.video2face(document.getElementById('vid_camera'), jsFD.canvas);

	//	200820 카운트다운중에는 분석결과 무시
	if (count321s > 0) dets=[];

	//	clear canvas
	document.getElementById('cvs_output').getContext('2d').clearRect(0, 0, document.getElementById('cvs_output').width, document.getElementById('cvs_output').height);

	//	캔버스 위치, 크기 확인 (디버깅)
	// jsFD.rect_face(document.getElementById('cvs_output').getContext('2d'), [0,0,$('#cvs_output').width(),$('#cvs_output').height()], '#F44', 8);


	//	200903 외곽에서 검출되지 않게함
	for(var n=dets.length-1; n>=0; n--) {
		if (dets[n][0] < jsFD.canvas.width*.1) {
			// console.log('out1');
			dets.splice(n,1);
			continue;
		}

		if (dets[n][0]+dets[n][2] > jsFD.canvas.width*.9) {
			// console.log('out2');
			dets.splice(n,1);
			continue;
		}

	}


	for(var n in dets) {

		if (dets!=null && dets.length==1 && dets[n][2] >= jsFD.config.min_width) {

			if (document.getElementById('vid_camera').videoWidth > document.getElementById('vid_camera').videoHeight) {
//				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), dets[n], '#0000ff', 3);

				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#0000ff', 3);

			}
			else {
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#0000ff', 3);
			}

			det_arr[det_cnt] = dets[n];
			face_arr[det_cnt] = jsFD.canvas.toDataURL('image/jpeg');

			$('.choice-photo img:eq('+det_cnt+')').attr('src', jsFD.crop_face_b64(jsFD.canvas, dets[n]) ).attr('title', 'w='+parseInt(dets[n][2])+',h='+parseInt(dets[n][3]));


			det_cnt++;

			if (det_cnt <= 2) {
				conf.tmr = setTimeout(' detect_face() ', conf.tmr2 );
			}
			else {
				// 2020.08.25 문구수정
				stop_camera('사진을 선택해주세요');
				$('p.guide-box').html('촬영된 사진 중 등록할 사진을 선택하신 후 [등록] 버튼을 클릭하세요.<br/>재촬영을 원하실 경우 [재촬영] 버튼을 눌러주세요<br/>');
			}

			return;
		}
		else if (dets.length > 1) {
			$('p.guide-box').html('<font color="red">본인 외 추가 얼굴이 확인되었습니다. 본인 외 추가 얼굴이 검출 될 경우 등록이 불가능합니다.</font><br/>');
		}
		else {

			$('p.guide-box').html('화면에 파란원이 보일때까지 얼굴 위치를 조정해 주세요<br/>');
			//	opencv 에서 인식은 되었지만 크기가 작은 경우에는 흐리게 표시함
			if (document.getElementById('vid_camera').videoWidth > document.getElementById('vid_camera').videoHeight) {
//				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), dets[n], '#888', 2);
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#888', 2);

			}
			else {
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#888', 2);
			}

		}

		break;	//	얼굴등록은 첫번째 얼굴만

	}

	conf.tmr = setTimeout(' detect_face() ', conf.tmr1 );

}


function detect_regist() {

	if (det_sel<0) {
		alert('등록할 사진을 선택해주세요');
		return;
	}

	// 200619 이미지업로드
	var param_str = '';
	param_str += 'exam_seq='+ _GET['exam_seq'];
	param_str += '&det_seq='+ _GET['det_seq'];
	param_str += '&user='+ _GET['user'];
	param_str += '&loc_seq='+ _GET['loc_seq'];
	param_str += '&inspector='+ _GET['inspector'];
	param_str += '&dets='+JSON.stringify(det_arr[det_sel]);
	param_str += '&b64='+face_arr[det_sel];


	$.ajax( 'json_regist.php', {
		type: 'post',
		data: param_str,
		beforeSend:function() {
			// ajax_loading2($('body'));
			// $('#ajax_loading').css('z-index',100).center();
		},
		error: function (xhr, ajaxOptions, thrownError) {
			// $('#ajax_loading').remove();
			alert(xhr.status+' '+thrownError);
		},
		success: function(data) {
			// $('#ajax_loading').remove();
			var ret = JSON.parse(data);

			if(ret.fr_regist.code!='00000') {
				alert('등록에 실패하였습니다.\n다른 사진을 선택하시거나 밝은곳에서 촬영을 해주십시요.');
				return;
			}

			// 2020.08.25 문구수정 및 강조
			var param = { title: '등록성공', mesg:'얼굴이 등록되었습니다.<br/>\n<strong>본인 얼굴 확인을 위해 재촬영 하겠습니다.</strong>', btn_html:''}
			param.btn_html='<button type="button" class="btn btn-primary" onClick="load_camera( detect_init2 ); return false;">확인</button>';

			$('body').append( tmpl_html('tmpl_modal', param) );
			$('#div_modal').modal();

			div_sts_box('등록된 얼굴을 확인하겠습니다.','');
			status_change('reg_yn', true);

		}

	});


}




//	얼굴확인에 사용
function detect_init2() {

	jsFD.set_video(document.getElementById('vid_camera'));

	//	210322 디자인변경으로 인한 추가
	$('p.guide-box').html('<br/><br/>');
	show_step(2);

	count321s=3;
	count3210();				//	카운트다운 2번째 => detect_face2로 실행

};


//	얼굴이 인식되면 서버에 전달해서 결과를 비교함
//	서버에서 여러번 실패하면 실패로 결과를 보냄
function detect_face2() {

	if (!sts.cam_yn) return;
	if (count321s > 0) {
		conf.tmr = setTimeout(' detect_face2() ', conf.tmr1 );
		return;
	}

	var dets = jsFD.video2face(document.getElementById('vid_camera'), jsFD.canvas);

	//	200820 카운트다운중에는 분석결과 무시
	if (count321s > 0) dets=[];

	//	clear canvas
	document.getElementById('cvs_output').getContext('2d').clearRect(0, 0, document.getElementById('cvs_output').width, document.getElementById('cvs_output').height);


	//	200903 외곽에서 검출되지 않게함
	for(var n=dets.length-1; n>=0; n--) {
		if (dets[n][0] < jsFD.canvas.width*.1) {
			// console.log('out1');
			dets.splice(n,1);
			continue;
		}

		if (dets[n][0]+dets[n][2] > jsFD.canvas.width*.9) {
			// console.log('out2');
			dets.splice(n,1);
			continue;
		}

	}


	for(var n in dets) {
		if (dets!=null && dets.length==1  && dets[0][2] >= jsFD.config.min_width) {

			if (document.getElementById('vid_camera').videoWidth > document.getElementById('vid_camera').videoHeight) {
//				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), dets[n], '#0000ff', 3);
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#0000ff', 3);
			}
			else {
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#0000ff', 3);
			}

			if (!sts.verifying) detect_verify(dets);
			conf.tmr = setTimeout(' detect_face2() ', conf.tmr2 );

			return;
		}
		else if (dets.length > 1) {
			$('p.guide-box').html('<font color="red">본인 외 추가 얼굴이 확인되었습니다. 본인 외 추가 얼굴이 검출 될 경우 등록이 불가능합니다.</font><br/>');
		}
		else {

			$('p.guide-box').html('화면에 파란원이 보일때까지 얼굴 위치를 조정해 주세요<br/>');
			//	opencv 에서 인식은 되었지만 크기가 작은 경우에는 흐리게 표시함
			if (document.getElementById('vid_camera').videoWidth > document.getElementById('vid_camera').videoHeight) {
//				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), dets[n], '#888', 2);
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#888', 2);
			}
			else {
				var face = [];
				face.push(dets[n][0] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][1] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				face.push(dets[n][2] * $('#cvs_output').width() / document.getElementById('vid_camera').videoWidth);
				face.push(dets[n][3] * $('#cvs_output').height() / document.getElementById('vid_camera').videoHeight);
				jsFD.arc_face(document.getElementById('cvs_output').getContext('2d'), face, '#888', 2);
			}

		}
	}	//for

	conf.tmr = setTimeout(' detect_face2() ', conf.tmr1 );

}


var verify_fail_cnt=0;
function detect_verify(dets) {
	if (sts.verifying) return;
	sts.verifying = true;

	// 200619 이미지업로드
	var param_str = '';
	param_str += 'exam_seq='+ _GET['exam_seq'];
	param_str += '&det_seq='+ _GET['det_seq'];
	param_str += '&user='+ _GET['user'];
	param_str += '&loc_seq='+ _GET['loc_seq'];
	param_str += '&inspector='+ _GET['inspector'];
	param_str += '&dets='+JSON.stringify(dets[0]);
	param_str += '&reg_yn=Y';
	param_str += '&b64='+jsFD.canvas.toDataURL('image/jpeg');


	$.ajax( 'json_verify.php', {
		type: 'post',
		data: param_str,
		beforeSend:function() {
			// ajax_loading2($('body'));
			// $('#ajax_loading').css('z-index',100).center();
		},
		error: function (xhr, ajaxOptions, thrownError) {
			sts.verifying = false;
			alert(xhr.status+' '+thrownError);
		},
		success: function(data) {
			sts.verifying = false;

			var ret = JSON.parse(data);
			// console.log(ret);
			// console.log(ret.fr_verify);
			if (ret.fr_verify!=undefined && ret.fr_verify.code != undefined && ret.fr_verify.code=='00000') {

				status_change('ver_yn',true);

				var param = {title:'등록성공', mesg:'등록된 얼굴과 일치합니다', btn_html:''}
				param.btn_html += '<button type="button" class="btn btn-primary" onClick="back_main(); return false;">확인</button>';

				$('body').append( tmpl_html('tmpl_modal', param) );
				$('#div_modal').modal().fadeOut("slow").fadeIn("slow");

				div_sts_box('등록된 얼굴과 일치합니다.','');
				stop_camera('');

				//	210322 디자인변경으로 인한 추가
				show_step(3);

			}
			else if (verify_fail_cnt>2) {
				verify_fail_cnt=0;
				var param = {title:'등록실패', mesg:'등록된 얼굴과 비교가 실패하였습니다', btn_html:''}
				param.btn_html +='<button type="button" class="btn btn-primary" onClick="load_camera( detect_init2 ); return false;">재확인</button>';
				param.btn_html +='<button type="button" class="btn btn-danger" onClick="back_main(); return false;">종료</button>';

				$('body').append( tmpl_html('tmpl_modal', param) );
				$('#div_modal').modal();

				div_sts_box('등록된 얼굴과 비교가 실패하였습니다.','');
				stop_camera('');
			}
			else {
				verify_fail_cnt++
			}

		}

	});


}



