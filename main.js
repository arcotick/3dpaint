

var size = document.getElementById('sizecontrol');
var depth = document.getElementById('depthcontrol');
var r = Math.sqrt(size.value);
var d = depth.value;
var painting = false;
var first = true;
var line = false;
var lineSelectPoint = true;
var p1xl, p1xr, p1y, p2xl, p2xr, p2y;
var px,py;
var mouse = true;

var left = document.getElementById('left');
var right = document.getElementById('right');
var ctxL = left.getContext('2d');
var ctxR = right.getContext('2d');


var watchtype = document.getElementById('watchtype');
var paintarea = document.getElementById('paintarea');

var colour = document.getElementById('color').value;
ctxL.strokeStyle = colour;
ctxR.fillStyle = colour;

var width = window.innerWidth/2*4/5,
	height = window.innerHeight*4/5;

left.width = width;
left.height = height;
right.width = width;
right.height = height;

var lefto = (window.innerWidth-2*left.width)/2,
	topo = (window.innerHeight-left.height)/2;

paintarea.style.left = lefto + 'px';
paintarea.style.top = topo + 'px';

paintarea.style.width = 2*left.width;
paintarea.style.height = left.height;

lmouse = document.getElementById('lmouse');
rmouse = document.getElementById('rmouse');

var mouseX, mouseY;

function hide(obj) {

    var el = document.getElementById(obj);

        el.style.display = 'none';

}

function paint(ctx, x, y, r, s) {
	ctx.beginPath();
	ctx.arc(x+s, y, r,0,2*Math.PI);
	ctx.fillStyle = colour;
	ctx.strokeStyle = colour;
	ctx.fill();
}

var onMouseDown = function() {
	paint(ctxL,mouseX,mouseY,r,-d/2);
	paint(ctxR,mouseX,mouseY,r,d/2);
	painting = true;
	
	pxl = mouseX-d/2;
	pxr = mouseX+d/2;
	py = mouseY;

	lineSelectPoint = !lineSelectPoint;
}

var onMouseUp = function() {
	painting = false;
	ctxL.beginPath();
	ctxR.beginPath();
	first = true;
}

var onKeyDown = function(e) {
	if (e.keyCode == 87) {
		r*=1.02;
	}
	if (e.keyCode == 83 && r>=1) {
		r*=0.98;
	}
	if (e.keyCode == 65) {
		if(watchtype.options.selectedIndex == 0) {d--} else if (watchtype.options.selectedIndex == 1) {d++};
		if(document.getElementById('dd').checked && r>=1) { r*=1/1.02; };
	}
	if (e.keyCode == 68) {
		if(watchtype.options.selectedIndex == 0) {d++} else if (watchtype.options.selectedIndex == 1) {d--};
		if(document.getElementById('dd').checked) { r*=1.02; };
	};

	if (watchtype.options.selectedIndex == 0) {
		depth.value = d;
	} else if (watchtype.options.selectedIndex == 1) {
		depth.value = -d;
	};
	size.value = r;

	var mouseE = new Object();
	mouseE.layerX = mouseX;
	mouseE.layerY = mouseY;
	if (watchtype.options.selectedIndex == 0) {
		updateCursor(mouseE, r, d);
	} else if (watchtype.options.selectedIndex == 1) {
		updateCursor(mouseE, r, -d);
	};
}

var update = function(e) {
	mouseX = e.layerX;
	mouseY = e.layerY;
	if (watchtype.options.selectedIndex == 0) {
		updateCursor(e, r, d);
	} else if (watchtype.options.selectedIndex == 1) {
		updateCursor(e, r, -d);
	};

	ctxL.lineWidth = 2*r;
	ctxR.lineWidth = 2*r;

	if (painting) {

		if (!first) {
			ctxL.lineTo(mouseX-d/2,mouseY);
			ctxL.stroke();
			ctxR.lineTo(mouseX+d/2,mouseY);
			ctxR.stroke();
		} else {
			ctxL.beginPath();
			ctxL.moveTo(pxl,py);
			ctxL.lineTo(mouseX-d/2,mouseY);
			ctxL.stroke();
			ctxR.beginPath();
			ctxR.moveTo(pxr,py);
			ctxR.lineTo(mouseX+d/2,mouseY);
			ctxR.stroke();
		}

		paint(ctxL, mouseX, mouseY, r, -d/2);
		paint(ctxR, mouseX, mouseY, r, d/2);

		ctxL.beginPath();
		ctxL.moveTo(mouseX-d/2, mouseY);
		ctxR.beginPath();
		ctxR.moveTo(mouseX+d/2, mouseY);
		first = false;
	}
}

function resetCanvas() {
	left.width = left.width;
	right.width = right.width;
}

function updateCursor(e, r, d) {
	mouseX = e.layerX;
	mouseY = e.layerY;

	var rad;
	r<1 ? rad = 1 : rad = r

	lmouse.style.width = 2*rad + 'px';
	lmouse.style.height = 2*rad + 'px';
	rmouse.style.width = 2*rad + 'px';
	rmouse.style.height = 2*rad + 'px';

	lmouse.style.left = mouseX-r-d/2+lefto + 'px';
	rmouse.style.left = mouseX-r+d/2+lefto + left.width + 'px';
	lmouse.style.top = mouseY-r+topo + 'px';
	rmouse.style.top = mouseY-r+topo + 'px';

	lmouse.style.background = colour;
	rmouse.style.background = colour;
}

function showBrush() {
	if (mouse) {
		document.getElementById('mousecontrol').innerHTML = 'Show mouse';
		document.getElementById('lmouse').style.opacity = 0;
		document.getElementById('rmouse').style.opacity = 0;
		mouse = false;
	} else {
		document.getElementById('mousecontrol').innerHTML = 'Hide mouse';
		document.getElementById('lmouse').style.opacity = 1;
		document.getElementById('rmouse').style.opacity = 1;
		mouse = true;
	}
}

var change3dtype = function() {
	if (watchtype.options.selectedIndex == 0) {
		left.style.left = 0 + 'px';
		right.style.left = 0 + 'px';
		lmouse.style.left = 0 + 'px';
		rmouse.style.left = 0 + 'px';
	} else if (watchtype.options.selectedIndex == 1) {
		left.style.left = width + 'px';
		right.style.left = -width + 'px';
		lmouse.style.left = width+2*d + 'px';
		rmouse.style.left = -width-2*d + 'px';
	};
}

left.addEventListener('mousemove', update);
window.addEventListener('keydown',onKeyDown);
window.addEventListener('keydown',onKeyDown);
left.addEventListener('mousedown', onMouseDown);
left.addEventListener('mouseup', onMouseUp);
right.addEventListener('mousedown', onMouseDown);
right.addEventListener('mouseup', onMouseUp);
size.addEventListener('mousemove', function() {
	r = size.value;
	ctxL.lineWidth=2*r;
	ctxL.lineWidth=2*r;
	updateCursor(this, r, d)
});
depth.addEventListener('mousemove', 
	function() {
		d = depth.value;
		r = size.value;
		if(document.getElementById('dd').checked && r>=1) { 
			if (d<0) {
				r += 1+d;
			};
			ctxL.lineWidth=2*r;
			ctxL.lineWidth=2*r;
		};
		size.value = r;
		updateCursor(this, r, d)
	}
);
color.addEventListener('change',function(e) {
	colour = color.value;
	ctxL.fillStyle = color;
	ctxL.strokeStyle = color;
	ctxR.fillStyle = color;
	ctxR.strokeStyle = color;
});
watchtype.addEventListener('change',change3dtype);
document.getElementById('canvascontrol').addEventListener('change', function() {
	width = window.innerWidth/2*this.value,
	height = window.innerHeight*this.value;

	left.width = width;
	left.height = height;
	right.width = width;
	right.height = height;

	lefto = (window.innerWidth-2*left.width)/2;
	topo = (window.innerHeight-left.height)/2;

	paintarea.style.left = lefto + 'px';
	paintarea.style.top = topo + 'px';

	paintarea.style.width = 2*left.width;
	paintarea.style.height = left.height;
})











