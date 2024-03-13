# 모델을 생성하는 파일
import torch
import torch.nn.functional as F
from transformers import PreTrainedTokenizerFast, GPT2LMHeadModel, AutoTokenizer, AutoModel

# Mean Pooling 함수
def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    return torch.sum(token_embeddings * input_mask_expanded, 1) / torch.clamp(input_mask_expanded.sum(1), min = 1e-9)

roberta_tokenizer = AutoTokenizer.from_pretrained("ddobokki/klue-roberta-small-nli-sts")
roberta_model = AutoModel.from_pretrained("ddobokki/klue-roberta-small-nli-sts")

Q_TKN = "<usr>"
A_TKN = "<sys>"
BOS = '</s>'
EOS = '</s>'
MASK = '<unused0>'
SENT = '<unused1>'
PAD = '<pad>'

koGPT2_TOKENIZER = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
            bos_token=BOS, eos_token=EOS, unk_token='<unk>',
            pad_token=PAD, mask_token=MASK)
model = GPT2LMHeadModel.from_pretrained('skt/kogpt2-base-v2')

special_tokens = ['<문제1>', '<문제2>', '<문제3>', '<문제4>', '<문제5>', '<문제6>', '<문제7>', '<문제8>', '<문제9>', '<문제10>', '<문제11>', '<문제12>', '<문제13>', '<문제14>', '<문제15>', '<문제16>', '<문제17>', '<문제18>', '<문제19>', '<문제20>', '<문제21>', '<문제22>', '<문제23>', '<문제24>', '<문제25>', '<문제26>', '<문제27>', '<문제28>', '<문제29>', '<문제30>']

koGPT2_TOKENIZER.add_special_tokens({'additional_special_tokens': special_tokens})
model.resize_token_embeddings(len(koGPT2_TOKENIZER))

device = torch.device ("cuda" if torch.cuda.is_available() else "cpu")

checkpoint = torch.load("./modelStorage/skt-kogpt2-base-v2-02070909-cuda.pth", map_location=torch.device(device))

model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

# 유사도 계산 함수
def get_similarity_scores_cleaning_version(user_question, stage):    
    stage_index = stage - 1

    print(stage_index)
    new_question =  ['말콤은 급한 상사의 연락을 받고 일을 해결하기 위해 자신의 개인 공구를 챙겨 급히 문을 나섰네. "하 이런 날까지 일을 해야 하다니..." 전혀 일을 할 정신이 아니었지만 빠르게 걸음을 옮겼다네. 급하게 계단을 내려가던 말콤 순간 발을 헛디뎌 버려 몇 계단 아래로 떨어져 버렸네. 엉덩이가 시큰시큰하지만 그는 프로답게 손을 더듬더듬하며 흩어진 자신의 공구들을 하나하나 찾아 모았다네. 잘 보이지는 않지만 모두 찾은 것 같네. 순간 말콤은 깨달았네.  자신의 아내가 죽어버렸다는 사실을, 그리고 고통스럽게 큰 소리로 울부짖었네. 그의 주변에는 아무것도 없었고 누군가 전화를 해준 것도 아니네.. 그는 어떻게 아내의 죽음에 대해 알게 된 것일까? 맞춰보게나.','A와 B와 C는 오랜 친구 사이네. A의 생일날 A는 B,C를 집에 초대했네. A의 집에 도착한 B,C는 A에게 준비한 선물을 주었네. B,C는 불을 끈 다음 초를 붙인후 생일축하 노래를 부르고 박수치며 A의 생일을 진심으로 축하했네. 그후 A는 매우 분노하여 B,C를 칼로 찔러 죽였네. 왜일지 맞춰보게나.','바다거북 마을 사람들은 거북꽃을 무척이나 좋아[아낀다]한다네. 거북꽃은 무척 아름다운 꽃으로 모두들[마을 사람들] 소중히 키웠네. 하지만 이 마을도 전쟁에 휘말려 수많은 사람들이 목숨을 잃고 부상을 당했네. 그러자 마을 사람들은 눈물을 흘리면서 거북꽃을 짓밟았다']

    new_answer = ['말콤은 쉬는 날 아픈 아내의 병원에 간병을 와있었네. 상사의 연락을 받고 계단을 내려가던 중 병원의 비상전력 등 모든 전기가 꺼져버리게 되고 정전이 돼버렸네. 말콤의 아내는 아파서 생명유지장치[전기]에 겨우 의지해 살아가고 있었기에 말콤은 아내의 죽음을 알게된 것이다.','A,B,C는 과거에 조난을 당한 적이 있었네. 먹을 것이 있어서 셋은 팔을 하나씩 잘라서 먹으며 버티기로 했었네. 시각장애를 가지고 있던 A는 모두의 팔을 한 짝씩 잘라서 음식을 만들었다는 B와 C의 말을 믿고 음식을 먹으며 버텼다네. 그들은 그 후 무사히 구조되었고 A의 생일 파티 날이 되었다네. A는 B와 C의[둘의] 박수 소리가 들렸다네. 두 개의 박수 소리를 듣고 B와 C가 거짓말을 했다는 것을 알게된 A가 화가 나서 둘을 죽인거네.','전쟁 때문에 마을 주변에는 무수히 많은 지뢰가 묻혀있었다. 마을 사람들은 마을을 탈출[이주, 떠나려]하려고 했다. 거북꽃이 피려면 최소 2년은 걸리는데 전쟁이 시작된 것은 2년은 되지 않았기 때문에 지뢰가 묻혀 있지 않았다. 즉, 거북꽃이 피어있는 곳은 안전(괜찮)함으로 사람들은 거북마을을 탈출[이주,떠나]하기 위해 그 위[거북꽃을 밟으며]를 걸어서 나갔네.']

    main_keyword = ['전기, 병원, 아픔, 정전, 아내, 말콤','A, B, C, 조난, 여행, 음식, 박수, 시각, 장애, 거짓말','전쟁, 마을, 지뢰, 탈출, 거북꽃, 2년, 안전, 목숨, 이주']

    sentences = [user_question, new_question[stage_index], new_answer[stage_index], main_keyword[stage_index]]

    encoded_input = roberta_tokenizer(sentences, padding=True, truncation=True, return_tensors="pt")

    model_output = roberta_model(**encoded_input)

    sentence_embeddings = mean_pooling(model_output, encoded_input["attention_mask"])

    score_question = round(float(F.cosine_similarity(sentence_embeddings[0].unsqueeze(0), sentence_embeddings[1].unsqueeze(0))), 4)
    score_answer = round(float(F.cosine_similarity(sentence_embeddings[0].unsqueeze(0), sentence_embeddings[2].unsqueeze(0))), 4)
    score_keyword = round(float(F.cosine_similarity(sentence_embeddings[0].unsqueeze(0), sentence_embeddings[3].unsqueeze(0))), 4)

    print(score_question, score_answer, score_keyword)
    return score_question, score_answer, score_keyword

# 모델이 대답을 생성하는 함수
def make_req(user_question, stage):
    global model
    index_set = {1: "1", 2: "11", 3: "28"}
    stage_set = {
        1: "말콤은 쉬는 날 아픈 아내의 병원에 간병을 와있었네. 상사의 연락을 받고 계단을 내려가던 중 병원의 비상전력 등 모든 전기가 꺼져버리게 되고 정전이 돼버렸네. 이때 말콤은 위독한 병에 걸려 생명유지장치에 겨우 의지해 살아가던 자신의 아내의 죽음을 확신하고 고통스러워한 것이었네.", 
        2: "A,B,C는 과거에 조난을 당한 적이 있었네. 먹을 것이 있어서 셋은 팔을 하나씩 잘라서 먹으며 버티기로 했었네. 시각장애를 가지고 있던 A는 모두의 팔을 한 짝씩 잘라서 음식을 만들었다는 B와 C의 말을 믿고 음식을 먹으며 버텼다네. 그들은 그 후 무사히 구조되었고 A의 생일 파티 날이 되었다네. A는 B와 C의 박수 소리가 들렸다네. 두 개의 박수 소리를 듣고 B와 C가 거짓말을 했다는 것을 알게된 A가 화가 나서 둘을 죽인거네.", 
        3: "전쟁에 휘말린 바다거북 마을 주변에는 무수히 많은 지뢰가 묻혀 있었고 수많은 피해가 발생했네. 마을 사람들은 마을을 탈출하려고 했으나 안전한 길을 알 수 없었네. 거북 꽃을 피우기에 최소 2년은 걸리기 때문에 거북꽃이 피어있는 곳은 최소한 2년간은 파헤쳐지지 않았다는 것을 의미했네. 전쟁이 시작된 것은 2년은 되지 않았기 때문에 지뢰가 묻혀 있지 않았다는 것이었고, 사람들을 거북마을을 탈출하기 위해 그 위를 걸어서 나갔네."
    }
    num = index_set[stage]
    correct=stage_set[stage]

    matchuri_answer = ""
    Q_num = '<문제'+num+'>'
    user_question =  correct + ' ' + user_question
    while 1:
        input_ids = torch.LongTensor(koGPT2_TOKENIZER.encode(Q_TKN + user_question + SENT + Q_num + A_TKN + matchuri_answer)).unsqueeze(dim=0)
        pred = model(input_ids)
        pred = pred.logits
        gen = koGPT2_TOKENIZER.convert_ids_to_tokens(torch.argmax(pred, dim=-1).squeeze().cpu().numpy().tolist())[-1]
        if gen == EOS:
            break
        matchuri_answer += gen.replace("▁", " ")
    return matchuri_answer.strip()



# user 에게 대답을 송출하는 함수
def return_req(user_question, stage):

    sim_score_question, sim_score_answer, sim_score_keyword = get_similarity_scores_cleaning_version(user_question, stage)

    if sim_score_answer > 0.70:
        matchuri_answer = "이젠 정답을 공개해도 되겠군. 아주 잘했네. 브리튼."
    elif sim_score_answer > 0.80:
        matchuri_answer = "완벽하네. 브리튼. 자네는 정말 대단하군."
    elif (sim_score_question < 0.21) & (sim_score_answer < 0.21) & (sim_score_keyword < 0.23):
        matchuri_answer = "문제와 관련이 없는 질문이네. 다른 질문을 해보게나. 브리튼."
    elif (sim_score_question < 0.3) & (sim_score_answer < 0.31) & (sim_score_keyword < 0.25):
        matchuri_answer = "그건 중요하지 않네. 브리튼. 다른 질문을 해보게."
    else:
        matchuri_answer = make_req(user_question, stage)
    
    return matchuri_answer