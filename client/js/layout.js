// 레이어 팝업창
function layerOn(el) {
    try {
        const layer = document.
            getElementById(el)
        layer.classList.add('fadeIn')
        layer.classList.remove('fadeOut')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}
function layerOut(el) {
    try {
        const layer = document.getElementById(el)
        layer.classList.add('fadeOut')
        layer.classList.remove('fadeIn')
    } catch (error) {
        console.error('레이어 팝업창을 표시하는 도중 오류 발생:', error);
    }
}