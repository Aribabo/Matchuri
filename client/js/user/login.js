const loginBtn = document.getElementById('loginBtn')
const txtWrap = document.querySelector('.layer-pop .txt-wrap')


loginBtn.addEventListener('click', async () => {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    // 로그인 패치
    try {
        const response = await fetch('http://localhost:8080/auth/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, password })
        })
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('_id',data.user._id)
            localStorage.setItem('token',data.token)

            window.location.href = '../../html/index.html';
            
        } else {
            txtWrap.innerText = '아이디, 비밀번호를 확인해주세요.'
            layerOn('loginLayer')
        }
    } catch (error) {
        console.error(error);
    }
})