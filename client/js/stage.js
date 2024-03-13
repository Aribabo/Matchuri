const stageUl = document.querySelector('#stage .bottom ul')
const _id = localStorage.getItem('_id');

function stageOpen(el, stageNum) {
    const txtWrap = document.querySelector('.txt-wrap')
    const btnWrap = document.querySelector('.layer-pop .btn-wrap')
    const startBtn = document.querySelector('.layer-pop button:first-child')

    // 완료스테이지
    if(el.classList.contains('finish')){
        txtWrap.innerHTML = '<span class="txt-point">완료된</span><br>스테이지입니다.'
        btnWrap.innerHTML = `
        <button type="button" class="grad-btn continueStage" onclick="lastStage(${stageNum},this)">기록보기</button>
        <div>
        <button type="button" class="point-btn-b resetStage" onclick="lastStage(${stageNum},this)">다시하기</button>
        <button type="button" class="black-btn" onclick="layerOut('stageLayer')">닫기</button>
        </div>
        `
    }else if(el.classList.contains('during')){
        // 진행중 스테이지
        txtWrap.innerHTML = '<span class="txt-point">진행중인</span><br>스테이지입니다.'
        btnWrap.innerHTML = `
        <button type="button" class="grad-btn continueStage" onclick="lastStage(${stageNum},this)">이어하기</button>
        <div>
        <button type="button" class="point-btn-b resetStage" onclick="lastStage(${stageNum},this)">다시하기</button>
        <button type="button" class="black-btn" onclick="layerOut('stageLayer')">닫기</button>
        </div>
        `
    }else{
        // 첫 스테이지
        txtWrap.innerHTML = '<span class="txt-point">게임을</span><br>시작 하시겠습니까?'
        btnWrap.innerHTML = `
        <button type="button" class="grad-btn firstStart" onclick="lastStage(${stageNum},this)">시작하기</button>
        <button type="button" class="black-btn" onclick="layerOut('stageLayer')">닫기</button>
        `
    }
    layerOn('stageLayer')
}

document.addEventListener('DOMContentLoaded', async ()=>{
    let solved_stage
    // 회원 정보 출력
    const user = await fetch('http://localhost:8080/auth/info',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id})
    })
    if(user.ok){
        const data = await user.json()
        console.log(data);
        solved_stage = data.conversation
    }

    // 전체 스테이지 패치
    const response = await fetch('http://localhost:8080/stage/all',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    if(response.ok){
        const data = await response.json()
        let startDict = {
            1: "★",
            2: "★★",
            3: "★★★",
            4: "★★★★",
            5: "★★★★★",
        }
        let html = ''
        data.forEach((el, idx)=>{
            if(solved_stage[el.N]['com'] == 2){
                html +=  `
                <li class="finish" onclick='stageOpen(this, ${el.N})'>
                    <div class="cont">
                        <div>
                            <div class="stage-num">
                                <div class="num">${el.N}</div>
                                <div>스테이지</div>
                            </div>
                            <div class="star">${startDict[el.L]}</div>
                            <div class="cate txt-point">${el.T}</div>
                        </div>
                    </div>
                    <div class="label">
                        <div>
                            <span>완료</span>
                        </div>
                    </div>
                </li>`
            }else if(solved_stage[el.N]['com'] == 0){
                html += `<li onclick='stageOpen(this, ${el.N})'>
                     <div class="cont">
                         <div>
                             <div class="stage-num">
                                 <div class="num">${el.N}</div>
                                 <div>스테이지</div>
                             </div>
                             <div class="star">${startDict[el.L]}</div>
                             <div class="cate">${el.T}</div>
                         </div>
                     </div>
                 </li>
                 `
            }else if(solved_stage[el.N]['com'] == 1){
            html += `<li class='during' onclick='stageOpen(this, ${el.N})'>
                <div class="cont">
                    <div>
                        <div class="stage-num">
                            <div class="num">${el.N}</div>
                            <div>스테이지</div>
                        </div>
                        <div class="star">${startDict[el.L]}</div>
                        <div class="cate">${el.T}</div>
                    </div>
                    <div class="label">
                    <div>
                        <span>진행중</span>
                    </div>
                </div>
                </div>
            </li>
            `
            }
        })
        stageUl.innerHTML = html
    }
})

async function stageComFetch(stageNum, com) {
    const comResponse = await fetch('http://localhost:8080/auth/update/com',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum, com})
    })
    if(comResponse.ok){
        const data = await comResponse.json()
        console.log('스테이지 상태 업데이트 완료');
    }
}

// text 업데이트(초기화했을 경우만)
async function resetTextFetch(stageNum) {
    const comResponse = await fetch('http://localhost:8080/auth/update/text',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum, data:""})
    })
    if(comResponse.ok){
        const data = await comResponse.json()
        console.log('text 초기화 완료');
    }
}

// lastStage 업데이트 패치 및 링크 이동
async function lastStage(stageNum, el) {
    const response = await fetch('http://localhost:8080/auth/update/last',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id, num:stageNum})
    })

    if(response.ok){
        const data = await response.json()
    }
    console.log(el);
    if(el.classList.contains('continueStage')){
        window.location.href = `./chat.html?q=${stageNum}&status=y`
    }else if(el.classList.contains('resetStage')){
        resetTextFetch(stageNum)
        window.location.href = `./chat.html?q=${stageNum}&status=n`
    }else if(el.classList.contains('firstStart')){
        stageComFetch(stageNum, 1)
        window.location.href = `./chat.html?q=${stageNum}&status=n`
    }
}