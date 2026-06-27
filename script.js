const story = [
  {
    speaker: "Narration",
    text: "어둠이 내려앉은 거리."
  },
  {
    speaker: "Narration",
    text: "저물어가는 하루를 마무리 하기 위해 사람들은 짙은 어둠 속으로 모인다."
  },
  {
    speaker: "Narration",
    text: "인파가 늘어남에 따라 뒷골목의 네온사인이 하나 둘 모습을 드러내고"
  },
  {
    speaker: "Narration",
    text: "어쩌면 정오보다 밝을 밤의 거리가 두 번째 오늘을 맞이하도록 금세 온 건물의 조명을 태운다."
  },
  {
    speaker: "Narration",
    text: "고된 반나절 간의 피로와 근심걱정 따위를 내일 아침이면 아무 일 없던 듯이 뒤로 넘겨버려야 하므로"
  },
  {
    speaker: "SYSTEM",
    text: "[ Chapter.1 조명이 밝은 밤 종료 ]"
  }
];

let index = 0;

const speaker = document.getElementById("speaker");
const dialogue = document.getElementById("dialogue");
const button = document.getElementById("next-button");

function showLine() {
  speaker.textContent = story[index].speaker;
  dialogue.textContent = story[index].text;
}

button.addEventListener("click", () => {
  index++;

  if (index >= story.length) {
    button.textContent = "×";
    return;
  }

  showLine();

  if (index === story.length - 1) {
    button.textContent = "끝";
  }
});

showLine();
