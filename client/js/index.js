document.addEventListener('DOMContentLoaded', async ()=>{
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    if(token){
        const response = await fetch('http://localhost:8080/auth/info',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({_id})
        })

        let stageLastNum = ''
        const lastStageTema = document.getElementById('lastStageTema')
        const lastStageStar = document.getElementById('lastStageStar')
        if(response.ok){
            const data = await response.json();
            const name = document.querySelector('#index .name')
            const numSolved = document.getElementById('numSolved')
            const lastStage = document.getElementById('lastStage')
            const continueBtn = document.getElementById('continueBtn')

            let text = ''
            let solvedCnt = 0
            // stageCtn 문제 개수 필요
            let stageCnt = Object.keys(data.conversation).length
            
            for (let index = 1; index <= stageCnt; index++) {
                if(data.conversation[index].com == 2){
                    solvedCnt += 1
                }
            }

            if(data.last_stage == "0"){
                text = '게임을<br>시작해주세요'
                lastStageStar.style.display = 'none'
                lastStageTema.style.display = 'none'
                continueBtn.innerText='게임을 시작해주세요'
                continueBtn.disabled = true;
            }else{
                text = `<span class='num'>${data.last_stage}</span><br>스테이지`
                continueBtn.innerText='이어하기'
                continueBtn.disabled = false;
            }

            name.innerText = data.userId;
            numSolved.innerHTML = `<span class="txt-point">${solvedCnt}</span>/${stageCnt}`
            lastStage.innerHTML = text

            stageLastNum = data.last_stage

            continueBtn.addEventListener('click',()=>{
                fn_continue(data)
            })
            
        }
        const stageFetch = await fetch('http://localhost:8080/stage/one',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({N:stageLastNum})
        })
        if(stageFetch.ok){
            const stageData = await stageFetch.json()
            star = ""
            lastStageTema.innerText = stageData.T;
            for(let i=1;i<=stageData.L;i++){
                star += "★"
            }
            lastStageStar.innerText = star;
        }

        
    }
})

// 이어하기 기능
function fn_continue(data) {
    const lastStage = parseInt(data.last_stage);
    const conv = data.conversation;
    const txtWrap = document.querySelector('.layer-pop .txt-wrap')
    const continueBtn = document.querySelector('.layer-pop .grad-btn')
    const reBtn = document.querySelector('.layer-pop .point-btn-b')

    if(conv[lastStage].com == 1){
        // 문제 진행중
        txtWrap.innerHTML = `<span class="txt-point">진행중</span>인 스테이지 입니다<br>다시 하시겠습니까?`

        // 이어하기
        continueBtn.addEventListener('click',()=>{
            window.location.href = `./chat.html?q=${lastStage}&status=y`
        })  
        // 다시하기
        reBtn.addEventListener('click',()=>{
            window.location.href = `./chat.html?q=${lastStage}&status=n`
        })
        layerOn('continueLayer')
    }else if(conv[lastStage].com == 2){
        // 완료
        txtWrap.innerHTML = `<span class="txt-point">완료</span>된 스테이지 입니다<br>다시 하시겠습니까?`
        continueBtn.innerText = '완료기록보기'
        
        continueBtn.addEventListener('click',()=>{
            window.location.href = `./chat.html?q=${lastStage}&status=y`
        })  
        // 다시하기
        reBtn.addEventListener('click',()=>{
            window.location.href = `./chat.html?q=${lastStage}&status=n`
        })
        layerOn('continueLayer')
    }
}
