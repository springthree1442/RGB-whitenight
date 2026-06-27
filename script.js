const story = [
  "사건 이후 2주가 지났다.",
  "《Gambit Rouge》는 경찰조사 이후 거의 철거를 앞두고 있었다.",
  "사수 z는 여전히 실종 상태였다.",
  "그리고 나는 현장 처리반에 임시 배정되었다."
];

let index = 0;

const dialogue = document.getElementById("dialogue");
const button = document.getElementById("next-button");

button.addEventListener("click", () => {
  index++;

  if (index >= story.length) {
    dialogue.textContent = "현재 준비된 이야기는 여기까지입니다.";
    button.textContent = "끝";
    return;
  }

  dialogue.textContent = story[index];
});
