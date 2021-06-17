		
var jsFD={};

// jsFD.debug			= false;
jsFD.debug			= true;

jsFD.uniq			= null;
jsFD.last_ts		= null;
jsFD.last_face		= null;

jsFD.canvas		= null;		//	이미지분석용 canvas

jsFD.tmr1		= null;
jsFD.tmr2		= null;

jsFD.config = {

	width: 640,
	height: 480,

	min_width: 200,
	
	pyrDown: 160,			//	160x120
	// pyrDown: 80,			//	80x60
	
};


jsFD.srcMat=null;
jsFD.grayMat=null;
jsFD.faceClassifier=null;



jsFD.init = function() { 
	// if (jsFD.debug) console.log(' jsFD.init(); ');

	if (jsFD.uniq != null) return;			//	중복방지
	jsFD.uniq = Math.random().toString(36).substring(2, 15);

	//	200503 분석용 canvas
	jsFD.canvas = document.createElement("canvas"); 
	jsFD.canvas.setAttribute('id', 'cvs_'+jsFD.uniq);
	jsFD.canvas.style.position		= 'absolute';
	jsFD.canvas.style.display		= 'none';
	jsFD.canvas.style.top			= 0;
	jsFD.canvas.style.left			= 0;
	// jsFD.canvas.style.right			= 0;

	// jsFD.canvas.style.display		= '';
	// document.body.appendChild(jsFD.canvas);

	jsFD.srcMat = new cv.Mat(jsFD.config.height, jsFD.config.width, cv.CV_8UC4);
	jsFD.grayMat = new cv.Mat(jsFD.config.height, jsFD.config.width, cv.CV_8UC1);
	jsFD.faceClassifier = new cv.CascadeClassifier();
	jsFD.faceClassifier.load('default.xml');

};


jsFD.load_camera = async function(vid, func) {

	vid.style.display	= '';
//	vid.style.width		= '';
//	vid.style.height	= '';

	let stream = null;

	try {
		stream = await navigator.mediaDevices.getUserMedia({video: {    width: { min: jsFD.config.width, max:jsFD.config.width },    height: { min: jsFD.config.height, max:jsFD.config.height }  }, audio: false});

		vid.srcObject = stream;
		// console.log(stream);
		func();
	}
	catch(err) {
		alert('카메라 연결에 실패하였습니다.\r\n카메라 연결 설정을 확인하시기 바랍니다.');

		try {
			var param = {};
				param.act_type='FAILCAM1';
				param.act_data={};
				param.act_data.url=location.href;
				param.act_data.GET=_GET;
				param.act_data.userAgent=navigator.userAgent;
				param.act_data.err=err.toString();

			$.ajax( 'act_log.php', {
				type: 'post',
				data: JSON.stringify(param)
			});


			//	201007 fail_url로 이동을 시킨다
			if (COMPLETE_URL2!=undefined) window.location.href=COMPLETE_URL2;
			
		}
		catch(e2) {
			;
		}


		throw err
	}
}


jsFD.stop_camera = async function(vid) {

	try {
		if (vid.srcObject) vid.srcObject.getTracks()[0].stop();
		// vid.style.display	= 'none';
	}
	catch(err) {
		console.log(err);
		throw err
	}
	
}



jsFD.set_video = function( vid ) {
	try {
		//	200521 비디오크기도 설정의 크기로
		vid.setAttribute('width', jsFD.config.width );
		vid.setAttribute('height', jsFD.config.height );

		vid.style.width = jsFD.config.width+'px';
		vid.style.height = jsFD.config.height+'px';

		//	200521 캔버스
		jsFD.canvas.setAttribute('width', jsFD.config.width);
		jsFD.canvas.setAttribute('height', jsFD.config.height );
	}
	catch(e) {
		;
	}
}



jsFD.crop_face_b64=function(cvs, face) {

	var canvas0=document.createElement('canvas');
		canvas0.width=face[2];
		canvas0.height=face[3];

	canvas0.getContext('2d').drawImage(cvs,face[0],face[1],face[2],face[3],0,0,face[2],face[3]);
	return canvas0.toDataURL('image/jpeg');

};


//	200519 비데오에서 얼굴찾기
jsFD.video2face = function(vid, cvs) { 

	cvs.getContext('2d').drawImage( vid, 0, 0, vid.videoWidth, vid.videoHeight);
/*
//var angleInRadians = -30 * Math.PI / 180;
var angleInRadians = 30 * Math.PI / 180;
var x = cvs.width / 2;
var y = cvs.height / 2;
var width = vid.videoWidth;
var height = vid.videoHeight;

cvs.getContext('2d').translate(x, y);
cvs.getContext('2d').rotate(angleInRadians);
cvs.getContext('2d').drawImage(vid, -width / 2, -height / 2, width, height);
cvs.getContext('2d').rotate(-angleInRadians);
cvs.getContext('2d').translate(-x, -y);
*/

	//	200901 가로세로전환에 대비함
	if (vid.videoWidth != jsFD.canvas.getAttribute('width') || vid.videoHeight != jsFD.canvas.getAttribute('height')) {
		//	200521 캔버스
		jsFD.canvas.setAttribute('width', vid.videoWidth);
		jsFD.canvas.setAttribute('height', vid.videoHeight );		
	}

	// return jsFD.cvs2face0(cvs);
	return jsFD.cvs2face(cvs);

};


//	200904 rewrite from example. https://docs.opencv.org/3.4/js_face_detection.html
jsFD.cvs2face = function(cvs) { 

	let dets = [];


	let src = new cv.Mat(cvs.height, cvs.width, cv.CV_8UC4);

	//	200907 
	try {
		src.data.set( cvs.getContext('2d').getImageData(0, 0, cvs.width, cvs.height).data );
	}
	catch(e) {
		return [];
		;
	}


	let gray = new cv.Mat();
	cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
	let faces = new cv.RectVector();


	//	피라미드다운
	var cnt=0;
	size = gray.size();
	while((size.width > jsFD.config.pyrDown || size.height > jsFD.config.pyrDown) && cnt < 5) {
	// while((size.width > 320 || size.height > 320) && cnt < 5) {
		cv.pyrDown(gray, gray);
		size = gray.size();
		cnt++;
	}
	
	let rx = cvs.width / size.width;
	let ry = cvs.height / size.height;

	// detect faces
	let msize = new cv.Size(0, 0);

	jsFD.faceClassifier.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
	
	for (let i =faces.size()-1; i>=0;i--) {
		let face = faces.get(i);
		dets.push([face.x*rx, face.y*ry, face.width*rx, face.height*ry]);
	// break;
	}
	src.delete(); gray.delete();
	faces.delete();

	try {

		//	200824 다중검출 오류보정
		if (dets.length>=2) {
			for(var n=dets.length-1; n>0; n--) {
				var dup_x = dets[n][0] + parseInt(dets[n][2]/2);
				var dup_y = dets[n][1] + parseInt(dets[n][3]/2);
				for(var n2=n-1; n2>=0; n2--) {

	//	좌상단이 겹칠때
					if ( dets[n2][0] < dets[n][0] && dets[n][0] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1] && dets[n][1] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }

	//	우상단이 겹칠때
					if ( dets[n2][0] < dets[n][0]+dets[n][2] && dets[n][0]+dets[n][2] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1] && dets[n][1] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }


	//	좌하단이 겹칠때
					if ( dets[n2][0] < dets[n][0] && dets[n][0] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1]+dets[n][3] && dets[n][1]+dets[n][3] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }


	//	우하단이 겹칠때
					if ( dets[n2][0] < dets[n][0]+dets[n][2] && dets[n][0]+dets[n][2] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1]+dets[n][3] && dets[n][1]+dets[n][3] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }

					 
				}
				// console.log(dets);
			}
		}
		
	}
	catch(e) {
		console.log(e);
		;
	}
	
	return dets;
};


//	200716 캔버스에서 얼굴찾기
jsFD.cvs2face0 = function(cvs) { 

// console.log(' jsFD.cvs2face ');
// return;

	let dets = [];
	let size;
	let faceVect = new cv.RectVector();
	let faceMat = new cv.Mat();

// console.log(cvs.getContext('2d').getImageData(0, 0, jsFD.config.width, jsFD.config.height).data);
	jsFD.srcMat.data.set( cvs.getContext('2d').getImageData(0, 0, jsFD.config.width, jsFD.config.height).data );

	//	face only
	cv.cvtColor(jsFD.srcMat, jsFD.grayMat, cv.COLOR_RGBA2GRAY);
	cv.pyrDown(jsFD.grayMat, faceMat);

	size = faceMat.size();
// console.log(size);

	let rx = jsFD.config.width / size.width;
	let ry = jsFD.config.height / size.height;

// var a = (new Date()).getTime();
	jsFD.faceClassifier.detectMultiScale(faceMat, faceVect);
// var b = (new Date()).getTime();
// console.log('elapsed0=', b-a);

	for (let i = 0; i < faceVect.size(); i++) {
		let face = faceVect.get(i);
		dets.push([face.x*rx, face.y*ry, face.width*rx, face.height*ry]);
	}
	faceMat.delete();
	faceVect.delete();


	try {
		//	200824 다중검출 오류보정
		if (dets.length>=2) {
			for(var n=dets.length-1; n>0; n--) {
				var dup_x = dets[n][0] + parseInt(dets[n][2]/2);
				var dup_y = dets[n][1] + parseInt(dets[n][3]/2);
				for(var n2=n-1; n2>=0; n2--) {

	//	좌상단이 겹칠때
					if ( dets[n2][0] < dets[n][0] && dets[n][0] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1] && dets[n][1] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }

	//	우상단이 겹칠때
					if ( dets[n2][0] < dets[n][0]+dets[n][2] && dets[n][0]+dets[n][2] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1] && dets[n][1] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }


	//	좌하단이 겹칠때
					if ( dets[n2][0] < dets[n][0] && dets[n][0] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1]+dets[n][3] && dets[n][1]+dets[n][3] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }


	//	우하단이 겹칠때
					if ( dets[n2][0] < dets[n][0]+dets[n][2] && dets[n][0]+dets[n][2] < dets[n2][0]+dets[n2][2] && 
						 dets[n2][1] < dets[n][1]+dets[n][3] && dets[n][1]+dets[n][3] < dets[n2][1]+dets[n2][3] ) {
							 dets.splice(n,1);
							 break;
					 }

					 
				}
				// console.log(dets);
			}
		}
	}
	catch(e) {
		console.log(e);
		;
	}	
	return dets;
};


//	200716 캔버스 얼굴 네모
jsFD.rect_face = function(ctx, face, strokeStyle, lineWidth) {
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.rect(face[0],face[1],face[2],face[3]);
	ctx.stroke();
};


//	200716 캔버스 얼굴 동그라미
jsFD.arc_face = function(ctx, face, strokeStyle, lineWidth) {
	var r = parseInt(face[2]/2);
	ctx.beginPath();
	ctx.strokeStyle = strokeStyle;
	ctx.lineWidth = lineWidth;
	ctx.arc(face[0]+r,face[1]+r, r,0, 2*Math.PI);
	ctx.stroke();
};


jsFD.rect_arr = function(ctx, dets, strokeStyle, lineWidth) {
	for(var n in dets) {
			jsFD.rect_face(ctx, dets[n], strokeStyle, lineWidth);
	}
};


jsFD.arc_arr = function(ctx, dets, strokeStyle, lineWidth) {
	for(var n in dets) {
			jsFD.arc_face(ctx, dets[n], strokeStyle, lineWidth);
	}
};



