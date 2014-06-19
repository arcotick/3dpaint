var canvas = document.getElementById('canvas');
canvas.focus();
var ctx = canvas.getContext('2d');
var img = canvas.toDataURL("image/png");

var w,h,lefto,topo;

function setupCanvasSize() {
	var dpi = window.devicePixelRatio || 1;

	w = window.innerWidth/2;
	h = window.innerHeight/2;

	console.log(w,h)

	lefto = (window.innerWidth-w)/2;
	topo = (window.innerHeight-h)/2;

	canvas.width = dpi * w;
	canvas.height = dpi * h;

	canvas.style.left = lefto + 'px';
	canvas.style.top = topo + 'px';
	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';

	ctx.scale(dpi,dpi);
}

function drawScene() {
	ctx.beginPath();
	ctx.moveTo(Math.round(w/2)+.5,0);
	ctx.lineTo(Math.round(w/2)+.5,h);
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = r*2;
}

function setupCanvas() {
	setupCanvasSize();
	drawScene();
}

window.onload = window.onresize = setupCanvas;

var count = 0;
var r = 2;
var painting = false;
var erasing = false;
var left = true;
var delta = 0;

var mouseX, mouseY;

function doKeyDown(e) {
	if (e.keyCode == 87 && r<=100) {r*=1.02};
	if (e.keyCode == 83 && r>=.8) {r*=0.98};
	if (e.keyCode == 68) {delta+=0.5;if (r<=100 && document.getElementById('depth').checked) {r*=1.02}; };
	if (e.keyCode == 65) {delta-=0.5;if(r>=.8 && document.getElementById('depth').checked) {r*=0.98}};
	if (e.keyCode == 90) {
		erasing = true;

		ctx.fillStyle = "white";
		ctx.strokeStyle = "white";
		document.getElementById('cursor1').style.background = 'white';
		document.getElementById('cursor1').style.border = '1px solid black';
		document.getElementById('cursor2').style.background = 'white';
		document.getElementById('cursor2').style.border = '1px solid black';
	};

	document.getElementById('cursor1').style.width = 2*r + 'px';
	document.getElementById('cursor1').style.height = 2*r + 'px';
	document.getElementById('cursor2').style.width = 2*r + 'px';
	document.getElementById('cursor2').style.height = 2*r + 'px';
	ctx.lineWidth = 2*r;

	var mouseE = new Object();
	mouseE.layerX = mouseX;
	mouseE.layerY = mouseY;
	movecursor(mouseE);
}
function doKeyUp(e) {
	if (e.KeyCode == 90 && erasing) {
		console.log(1);
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		document.getElementById('cursor1').style.background = 'black';
		document.getElementById('cursor1').style.border = '1px solid rgba(0,0,0,0)';
		document.getElementById('cursor2').style.background = 'black';
		document.getElementById('cursor2').style.border = '1px solid rgba(0,0,0,0)';
		erasing = false;
	};
}

var putPoint = function(e) {
	if (painting) {
		var px = mouseX + w/2 + delta/2;
		var py = mouseY;

		if (count == 0) {
			oldpx = mouseX + w/2 + delta/2;
			oldpy = mouseY;
		};

		ctx.lineTo(mouseX-delta/2,mouseY);
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(mouseX-delta/2,mouseY,r,0,2*Math.PI);
		ctx.arc(px, py,r,0,2*Math.PI);
		ctx.fill();

		ctx.beginPath();
		ctx.moveTo(px, py);
		ctx.lineTo(oldpx, oldpy);
		ctx.stroke();

		oldpx = mouseX + w/2 + delta/2;
		oldpy = mouseY;

		ctx.moveTo(mouseX-delta/2,mouseY);
		count++;

		document.getElementById('cursor1').style.width = 2*r + 'px';
		document.getElementById('cursor1').style.height = 2*r + 'px';
		document.getElementById('cursor2').style.width = 2*r + 'px';
		document.getElementById('cursor2').style.height = 2*r + 'px';
	}
}

var start = function(e) {
	painting = true;
	putPoint(e);
}

var end = function(e) {
	if (erasing) {
		ctx.fillStyle = "black";
		ctx.strokeStyle = "black";
		document.getElementById('cursor1').style.background = 'black';
		document.getElementById('cursor1').style.border = '1px solid rgba(0,0,0,0)';
		document.getElementById('cursor2').style.background = 'black';
		document.getElementById('cursor2').style.border = '1px solid rgba(0,0,0,0)';
		erasing = false;
	};
	painting = false;
	ctx.beginPath();
	count = 0;
}

var movecursor = function(e) {
	mouseX = e.layerX;
	mouseY = e.layerY;

	document.getElementById('cursor1').style.left = mouseX-r-delta/2+lefto + 'px';
	document.getElementById('cursor1').style.top = mouseY-r+topo + 'px';
	document.getElementById('cursor2').style.left = mouseX-r+delta/2+lefto+w/2 + 'px';
	document.getElementById('cursor2').style.top = mouseY-r+topo + 'px';
}

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', end);
window.addEventListener('keydown', doKeyDown);
window.addEventListener('keyup', doKeyUp);
canvas.addEventListener('mousemove', movecursor);
