from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from model import return_req

app = FastAPI()

# CORS Error 방지를 목적으로 하며 요청 페이지 주소를 넣으면 해당 url 에 대한 CORS Error 막아준다
origins = [
    "http://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    # 브라우저 요청에 인증 정보를 포함
    allow_methods=["*"],
    allow_headers=["*"]
)


# 추후 모델 업데이트를 위한 질문 및 대답 History
history_chat = {}

# 들어오는 질문에 대한 힌트
class Chat(BaseModel):
    text: str
    q: str

@app.post("/chat")
async def make_chat(data: Chat):
    global history_chat

    user_question = data.text
    stage = int(data.q)

    print(user_question, stage)

    # 모델이 대답을 생성하는 함수 make_req(user_question) 으로 질문을 전달하고, matchuri_answer 에 저장해주세요
    # matchuri_answer_tmp = "정말 좋은 질문이군 브리튼. 이제 답을 맞춰보겠나?"
    # print(matchuri_answer_tmp)
    
    # response = {
    #     "text": matchuri_answer_tmp
    # }

    matchuri_answer = return_req(user_question, stage)
    print(matchuri_answer)
    
    response = {
        "text": matchuri_answer
    }

    return response