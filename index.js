// 시작 페이지 오늘 날짜를 자동으로 표시합니다.
const now = new Date();
const dateArea = document.querySelector("#today-date");
if (dateArea) {
  dateArea.textContent = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
}
