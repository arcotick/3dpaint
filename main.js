var canvas = document.getElementById('canvas');
canvas.focus();
var ctx = canvas.getContext('2d');
var img = canvas.toDataURL("image/png");


canvas.width = window.innerWidth/2;
canvas.height = window.innerHeight/2;

var lefto = (window.innerWidth-canvas.width)/2,
	topo = (window.innerHeight-canvas.height)/2;

canvas.style.left = lefto + 'px';
canvas.style.top = topo + 'px';

var cursorL = document.getElementById('cursor1'),
	cursorR = document.getElementById('cursor2');

var brush = true;

function showBrush() {
	if (brush) {
		document.getElementById('brush').innerHTML = "Show brush";
		cursorR.style.opacity = 0;
		cursorL.style.opacity = 0;
		brush = false;
	} else {
		document.getElementById('brush').innerHTML = "Hide brush";
		cursorR.style.opacity = 1;
		cursorL.style.opacity = 1;
		brush = true;
	};
}

window.onload = function() {
	ctx.beginPath();
	ctx.moveTo(Math.round(canvas.width/2)+.5,0);
	ctx.lineTo(Math.round(canvas.width/2)+.5,canvas.height);
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = r*2;
}

window.onresize = function() {
	canvas.width = window.innerWidth/2;
	canvas.height = window.innerHeight/2;
	ctx.beginPath();
	ctx.moveTo(canvas.width/2+.5,20);
	ctx.lineTo(canvas.width/2+.5,canvas.height-20);
	ctx.strokeStyle = "#666";
	ctx.lineWidth = 1;
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = r*2;
}

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
		erasing = !erasing;

		if (erasing) {
			ctx.fillStyle = "white";
			ctx.strokeStyle = "white";
			cursorL.style.background = 'white';
			cursorL.style.border = '1px solid black';
			cursorR.style.background = 'white';
			cursorR.style.border = '1px solid black';
		} else {
			ctx.fillStyle = "black";
			ctx.strokeStyle = "black";
			cursorL.style.background = 'black';
			cursorL.style.border = '1px solid rgba(0,0,0,0)';
			cursorR.style.background = 'black';
			cursorR.style.border = '1px solid rgba(0,0,0,0)';
		}
	};

	cursorL.style.width = 2*r + 'px';
	cursorL.style.height = 2*r + 'px';
	cursorR.style.width = 2*r + 'px';
	cursorR.style.height = 2*r + 'px';
	ctx.lineWidth = 2*r;

	var mouseE = new Object();
	mouseE.layerX = mouseX;
	mouseE.layerY = mouseY;
	movecursor(mouseE);
}

var putPoint = function(e) {
	if (painting) {
		var px = mouseX + canvas.width/2 + delta/2;
		var py = mouseY;

		if (count == 0) {
			oldpx = mouseX + canvas.width/2 + delta/2;
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

		oldpx = mouseX + canvas.width/2 + delta/2;
		oldpy = mouseY;

		ctx.moveTo(mouseX-delta/2,mouseY);
		count++;

		cursorL.style.width = 2*r + 'px';
		cursorL.style.height = 2*r + 'px';
		cursorR.style.width = 2*r + 'px';
		cursorR.style.height = 2*r + 'px';
	}
}

var start = function(e) {
	painting = true;
	putPoint(e);
}

var end = function(e) {
	painting = false;
	ctx.beginPath();
	count = 0;
}

var movecursor = function(e) {
	mouseX = e.layerX;
	mouseY = e.layerY;

	cursorL.style.left = mouseX-r-delta/2+lefto + 'px';
	cursorL.style.top = mouseY-r+topo + 'px';
	cursorR.style.left = mouseX-r+delta/2+lefto+canvas.width/2 + 'px';
	cursorR.style.top = mouseY-r+topo + 'px';
}

function changeColor(e) {
	ctx.fillStyle = e.style.background;
	ctx.strokeStyle = e.style.background;
	cursorL.style.background = e.style.background;
	cursorR.style.background = e.style.background;
}

canvas.addEventListener('mousedown', start);
canvas.addEventListener('mousemove', putPoint);
canvas.addEventListener('mouseup', end);
window.addEventListener('keydown', doKeyDown);
canvas.addEventListener('mousemove', movecursor);
