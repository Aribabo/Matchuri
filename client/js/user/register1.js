function viewMore(event, el) {
    try {
        // Check if the click originated from the checkbox
        if (event.target.tagName.toLowerCase() === 'input' && event.target.type === 'checkbox') {
            return;
        }

        // Stop event propagation
        event.stopPropagation();

        let agreeWrap = el.firstElementChild;
        let detail = el.lastElementChild;

        if (agreeWrap.classList.contains('active')) {
            agreeWrap.classList.remove('active');
            detail.classList.add('fadeOut');
            detail.classList.remove('fadeIn');
        } else {
            agreeWrap.classList.add('active');
            detail.classList.add('fadeIn');
            detail.classList.remove('fadeOut');
        }
    } catch (error) {
        console.error('이용약관 동의 오류:', error.message);
    }
}

const cheks = document.querySelectorAll('input[type="checkbox"]')

function agreeCheck() {
    const allChecked = Array.from(cheks).every((el) => el.checked);

    if (allChecked) {
        window.location.href = 'register2.html';
    } else {
        layerOn('agreeLayer');
    }
}