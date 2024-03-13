const idCheckBtn = document.getElementById('idCheckBtn')
const txtWrap = document.querySelector('.layer-pop .txt-wrap')
const layerBtn = document.querySelector('.layer-pop .btn-wrap button:first-child')

const userIdInput = document.getElementById('userId')
const idHidden = document.getElementById('idHidden')
const passwordInput = document.getElementById('password')
const passwordCheckInput = document.getElementById('passwordCheck')
const hpInput = document.getElementById('HP')
const hpAuthCheck = document.getElementById('hpAuthCheck')
const patternPhone =  /^\d{3}-\d{4}-\d{4}$/;


// 아이디 중복검사.
idCheckBtn.addEventListener('click',async ()=>{
    const userId = userIdInput.value
    // 패치
    const response = await fetch('http://localhost:8080/auth/searchId',{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId:userId})
    })

    if(response.ok){
        txtWrap.innerHTML = `<span class="txt-point">${userId}</span>은<br>사용 가능한 아이디입니다.`
        idHidden.value = 'y'
        userIdInput.disabled = true
    }else{
        txtWrap.innerHTML = `<span class="txt-point">${userId}</span>은<br>이미 있는 아이디입니다.`
    }
    layerOn('regist2Layer');
})




// 회원가입 유효성 검사
function registCheck() {
    if(idHidden.value == 'n'){
        userIdInput.parentElement.nextElementSibling.style.display = 'block'
        userIdInput.parentElement.nextElementSibling.innerText = '아이디 중복검사를 해주세요.'

        return false
    }
    if(userIdInput.value.length == 0){
        userIdInput.parentElement.nextElementSibling.style.display = 'block'
        userIdInput.focus()
        return false
    }
    if(passwordInput.value.length == 0){
        passwordInput.nextElementSibling.style.display = 'block'
        passwordInput.focus()
        return false
    }
    if(passwordInput.value != passwordCheckInput.value){
        passwordCheckInput.parentElement.nextElementSibling.style.display = 'block'
        passwordCheckInput.focus()
        return false
    }
    if(hpInput.value.length == 0) {
        hpInput.nextElementSibling.style.display = 'block'
        hpInput.nextElementSibling.innerText = '핸드폰 번호를 입력해주세요'
        hpInput.focus()
        return false
    }
    if(hpAuthCheck.value == 'n'){
        hpAuthCheck.nextElementSibling.style.disabled = 'block';
        hpAuthCheck.focus()
        return false
    }
    signUp()
}

async function signUp() {
    const HP = hpInput.value.replace(/[^0-9]/g, '')
    const response = await fetch('http://localhost:8080/auth/signUp',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId:userIdInput.value,
            password:passwordInput.value,
            HP:HP,
        })
    })
    if(response.ok){
        const data = await response.json()
        txtWrap.innerHTML = `회원가입이<br><span class="txt-point">완료</span>되었습니다.`

        layerOn('regist2Layer')
        layerBtn.addEventListener('click',()=>{
            window.location.href = `./register3.html?userId=${userIdInput.value}`
        })

    }
}

// 비밀번호 확인 이벤트
passwordCheckInput.addEventListener('input',()=>{
    const pwVal = passwordInput.value
    if(pwVal != passwordCheckInput.value){
        passwordCheckInput.parentElement.nextElementSibling.style.display = 'block' 
    }
    if(passwordCheckInput.value.length == 0){
        passwordCheckInput.parentElement.nextElementSibling.style.display = 'none' 
    }
    if(pwVal == passwordCheckInput.value){
        passwordCheckInput.disabled = true
        passwordInput.disabled = true
        passwordCheckInput.nextElementSibling.classList.add('active')
        passwordInput.nextElementSibling.style.display = 'none'
        passwordCheckInput.parentElement.nextElementSibling.style.display = 'none' 
    }
})

// 인증번호 발송
const hpCheckBtn = document.getElementById('hpCheckBtn')
const authCheckBtn = document.getElementById('authCheckBtn')
const hpAuth = document.querySelector('.hp-auth');

hpInput.addEventListener('input', async()=>{
    if(!patternPhone.test(hpInput.value)) {
        hpInput.nextElementSibling.style.display = 'block'
        hpInput.nextElementSibling.innerText = '휴대폰 번호를 010-1234-5678 형식으로 입력해주세요.'
        hpInput.focus()
    } else {
        hpInput.disabled = true
        hpInput.nextElementSibling.style.display = 'none'; // 수정: 'errorElement' 대신 'hpInput.nextElementSibling' 사용
        hpCheckBtn.disabled = false;

        hpCheckBtn.addEventListener('click',async ()=>{
            const HP = hpInput.value.replace(/[^0-9]/g, '')
            const response = await fetch('http://localhost:8080/auth/sendVerification',{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ HP: HP })
            })

            if(response.ok){
                txtWrap.innerHTML = '<span class="txt-point">인증번호</span>가<br>발송 되었습니다.'

            }else{
                txtWrap.innerHTML = '<span class="txt-point">핸드폰번호</span>를<br>확인해주세요.'
            }
            layerOn('regist2Layer');
        })

        layerBtn.addEventListener('click',()=>{
            hpAuth.classList.add('fadeIn')
            hpCheckBtn.classList.add('fadeOut')
        })

    }
})

authCheckBtn.addEventListener('click',async ()=>{
    const verificationCode = document.getElementById('hpAuth')
    const HP = hpInput.value.replace(/[^0-9]/g, '')
    const response = await fetch('http://localhost:8080/auth/verifyCode',{
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ HP: HP, verificationCode:verificationCode.value })
    })

    if(response.ok){
        txtWrap.innerHTML = '<span class="txt-point">인증번호</span>가<br>확인되었습니다.'
        verificationCode.disabled = true
        authCheckBtn.style.display = 'none'
        hpAuthCheck.value = 'y'
    }else{
        txtWrap.innerHTML = '<span class="txt-point">인증번호</span>를<br>확인해주세요.'
    }
    layerOn('regist2Layer');
})