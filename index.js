// 2주차: Date 객체로 시작 페이지의 현재 날짜 표시
const today = new Date();
const dateText = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
document.querySelector("#today-date").textContent = dateText;
