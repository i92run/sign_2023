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
        url : "http://127.0.0.1:8000/saveSign",
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
        url : "http://127.0.0.1:8000/detectImage",
        data : formdata,
        processData : false,
        contentType : false,
        async : false,
        success : function(resp){
            // alert(JSON.stringify(resp['detect']))
            window.location.href = 'http://127.0.0.1:8000/result/' + JSON.stringify(resp['detect'])

        },
        error: function(xtr, status, error){
            alert(error)
        }
    });
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
}