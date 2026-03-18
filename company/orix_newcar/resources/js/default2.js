/** 인풋에 value값 있을 때 버튼 활성화하기 **/
const inputField = document.querySelector('.inputField');
const myButton = document.querySelector('.btn-input');

// input에 변화가 생길 때마다 실행
inputField.addEventListener('input', function() {
    if (inputField.value.trim() !== "") {
        // 입력 값이 있으면 버튼을 활성화
        myButton.classList.add('active');
        myButton.disabled = false; // 버튼 활성화
    } else {
        // 입력 값이 없으면 버튼을 비활성화
        myButton.classList.remove('active');
        myButton.disabled = true; // 버튼 비활성화
    }
});