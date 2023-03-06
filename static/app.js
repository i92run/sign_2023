const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

ctx.strokeStyle = "black";
ctx.lineWidth = 2.5;

let painting = false;

function startPainting() {
    painting=true;
}
function stopPainting(event) {
    painting=false;
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if(!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function eraseCanvas(){
    var canvas = document.getElementById('jsCanvas');
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function saveSign() {
    var canvas = document.getElementById('jsCanvas');
    var imgDataUrl = canvas.toDataURL('image/png');
    var blobBin = atob(imgDataUrl.split(',')[1]);
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
    var formdata = new FormData();
    formdata.append("file", file);
    var name = document.getElementById('name').value;
    formdata.append("name", name);
    $.ajax({
        type : "POST",
        url : "/saveSign",
        data : formdata,
        processData : false,
        contentType : false,
        async : false,
        success : function(resp){
            // alert(JSON.stringify(resp['detect']))
            // window.location.href = 'http://127.0.0.1:8000/result/' + JSON.stringify(resp['save'])
            alert("save")
            eraseCanvas()
        },
        error: function(xtr, status, error){
            alert(error)
        }
    });
}

function detectImage() {
    var canvas = document.getElementById('jsCanvas');
    var imgDataUrl = canvas.toDataURL('image/png');
    var blobBin = atob(imgDataUrl.split(',')[1]);
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    var file = new Blob([new Uint8Array(array)], {type: 'image/png'});
    var formdata = new FormData();
    formdata.append("file", file);
    $.ajax({
        type : "POST",
        url : "/detectImage",
        data : formdata,
        processData : false,
        contentType : false,
        async : false,
        success : function(resp){
            // alert(JSON.stringify(resp['detect']))
            window.location.href = '/result/' + JSON.stringify(resp['detect'])

        },
        error: function(xtr, status, error){
            alert(error)
        }
    });
}

function tool_pencil() {
    var tool = this;
    this.started = false;

    // 마우스를 누르는 순간 그리기 작업을 시작 한다.
    this.mousedown = function (ev) {
	context.beginPath();
	context.moveTo(ev._x, ev._y);
	tool.started = true;
    };
    // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
    this.mousemove = function (ev) {
	if (tool.started) {
	    context.lineTo(ev._x, ev._y);
	    context.stroke();
	}
    };
    // 마우스 떼면 그리기 작업을 중단한다
    this.mouseup = function (ev) {
	if (tool.started) {
	    tool.mousemove(ev);
	    tool.started = false;
	}
    };

    // 마우스를 누르는 순간 그리기 작업을 시작 한다.
    this.touchstart = function (ev) {
	context.beginPath();
	context.moveTo(ev._x, ev._y);
	tool.started = true;
    };
    // 마우스가 이동하는 동안 계속 호출하여 Canvas에 Line을 그려 나간다
    this.touchmove = function (ev) {
	if (tool.started) {
	    context.lineTo(ev._x, ev._y);
	    context.stroke();
	}
    };
    // 마우스 떼면 그리기 작업을 중단한다
    this.touchend = function (ev) {
	if (tool.started) {
	    tool.touchmove(ev);
	    tool.started = false;
	}
    };
}

function ev_canvas(ev) {
    if (ev.layerX || ev.layerX == 0) { // Firefox 브라우저
	ev._x = ev.layerX;
	ev._y = ev.layerY;
    }
    else if (ev.offsetX || ev.offsetX == 0) { // Opera 브라우저
	ev._x = ev.offsetX;
	ev._y = ev.offsetY;
    }
    else if (ev.targetTouches[0] || ev.targetTouches[0].pageX == 0) {	//핸드폰
	var left = 0;
	var top = 0;
	var elem = document.getElementById('drawCanvas');

	while (elem) {
	    left = left + parseInt(elem.offsetLeft);
	    top = top + parseInt(elem.offsetTop);
	    elem = elem.offsetParent;
	}

	ev._x = ev.targetTouches[0].pageX - left;
	ev._y = ev.targetTouches[0].pageY - top;
    }
    // tool의 이벤트 핸들러를 호출한다.
    var func = tool[ev.type];
    if (func) {
	func(ev);
    }
}

if (canvas) {
    var context = canvas.getContext('2d')
    tool = new tool_pencil();
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener('touchstart', ev_canvas, false);
    canvas.addEventListener('touchmove', ev_canvas, false);
    canvas.addEventListener('touchend', ev_canvas, false);
}

