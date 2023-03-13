from fastapi import FastAPI, APIRouter
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi import Request, UploadFile, File, Form

# import uuid

router = APIRouter()

@router.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("root.html", {"request": request})

@router.get("/signIn", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("signIn.html", {"request": request})

@router.get("/signUp", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("signUp.html", {"request": request})

@router.post("/saveSign")
async def save_sign(file: UploadFile = File(), name: str = Form(), x_file: UploadFile = File(), y_file: UploadFile = File(), d_file: UploadFile = File()):
    data = file.file.read()
    x_data = x_file.file.read()
    y_data = y_file.file.read()
    d_data = d_file.file.read()
    x_list = np.frombuffer(x_data, dtype='uint16')
    y_list = np.frombuffer(y_data, dtype='uint16')
    d_list = np.frombuffer(d_data, dtype='uint16')
    # en = base64.b64encode(x_data)
    # de = base64.b64decode(en)
    print(x_list)
    print(y_list)
    print(d_list)

    imgdata = data + b'=' * (-len(data) % 4)
    dirname = "./sign/"
    filename = "test.png"
    with open(dirname + filename, 'wb') as f:  # 추후 벡터 저장
        f.write(imgdata)

    print(name)

    return {"save": name}

import numpy as np
import base64
@router.post("/detectImage")
async def detect_image(file: UploadFile = File(), x_file: UploadFile = File(), y_file: UploadFile = File(), d_file: UploadFile = File()):
    data = file.file.read()
    x_data = x_file.file.read()
    y_data = y_file.file.read()
    d_data = d_file.file.read()
    x_list = np.frombuffer(x_data, dtype='uint16')
    y_list = np.frombuffer(y_data, dtype='uint16')
    d_list = np.frombuffer(d_data, dtype='uint16')
    # en = base64.b64encode(x_data)
    # de = base64.b64decode(en)
    print(x_list)
    print(y_list)
    print(d_list)

    imgdata = data + b'=' * (-len(data) % 4)
    dirname = "./sign/"
    filename = "test.png"
    with open(dirname + filename, 'wb') as f:
        f.write(imgdata)

    # 모델 판별
    detect_result = 1  # 판별 결과

    return {"detect": detect_result}

@router.get("/result/{detect}", response_class=HTMLResponse)
async def result(request: Request, detect: int):
    return templates.TemplateResponse("result.html", {"request": request, "result": detect})

app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(router)
