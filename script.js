// ===============================
// 백야: 일출과 일몰 사이
// 기본 대사 엔진
// ===============================

let playerName = "플레이어";
let currentIndex = 0;
let currentScript = [];
let isWaitingChoice = false;

let isTyping = false;
let typingTimer = null;
let fullText = "";
let typingSpeed = 50; // 숫자가 작을수록 빠름

const SAVE_KEY = "rgb_whitenight_save";

// 화면 요소
const titleScreen = document.getElementById("title-screen");
const nameScreen = document.getElementById("name-screen");
const playScreen = document.getElementById("play-screen");

const startButton = document.getElementById("start-button");
const continueButton = document.getElementById("continue-button");
const nameInput = document.getElementById("name-input");
const nameConfirmButton = document.getElementById("name-confirm-button");

const speakerName = document.getElementById("speaker-name");
const dialogueText = document.getElementById("dialogue-text");
const dialogueBox = document.getElementById("dialogue-box");
const choiceBox = document.getElementById("choice-box");
const chapterTitle = document.getElementById("chapter-title");
const eventPopup = document.getElementById("event-popup");

const taskButton = document.getElementById("task-button");
const taskPanel = document.getElementById("task-panel");
const closeTaskButton = document.getElementById("close-task-button");

const saveButton = document.getElementById("save-button");
const titleButton = document.getElementById("title-button");

// ===============================
// 화면 전환
// ===============================

function showScreen(screen) {
  titleScreen.classList.remove("active");
  nameScreen.classList.remove("active");
  playScreen.classList.remove("active");

  screen.classList.add("active");
}

// ===============================
// 저장 / 불러오기
// ===============================

function saveGame() {
  const saveData = {
    playerName,
    currentIndex,
    chapter: "chapter1"
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function loadGame() {
  const rawData = localStorage.getItem(SAVE_KEY);

  if (!rawData) {
    alert("저장된 데이터가 없습니다.");
    return;
  }

  const saveData = JSON.parse(rawData);

  playerName = saveData.playerName || "플레이어";
  currentIndex = saveData.currentIndex || 0;
  currentScript = CHAPTER_1;

  showScreen(playScreen);
  renderCurrentLine();
}

function hasSaveData() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

// ===============================
// 텍스트 처리
// ===============================
function typeText(text) {
  clearTimeout(typingTimer);

  isTyping = true;
  fullText = text;
  dialogueText.textContent = "";

  let i = 0;

  function typing() {
    if (i < fullText.length) {
      dialogueText.textContent += fullText[i];
      i++;
      typingTimer = setTimeout(typing, typingSpeed);
    } else {
      isTyping = false;
    }
  }

  typing();
}

function showFullText() {
  clearTimeout(typingTimer);
  dialogueText.textContent = fullText;
  isTyping = false;
}

function replacePlayerName(text) {
  return text.replaceAll("{player}", playerName);
}

function getCharacterName(characterId) {
  if (!characterId) return "";

  const character = CHARACTERS[characterId];

  if (!character) return characterId;

  if (characterId === "player") {
    return playerName;
  }

  return character.name;
}

function getCharacterColor(characterId) {
  const character = CHARACTERS[characterId];

  if (!character) return "#f2f4f8";

  return character.color || "#f2f4f8";
}

function showEventPopup(text) {
  eventPopup.textContent = text.replace("[", "").replace("]", "").trim();

  eventPopup.classList.remove("hidden");
  eventPopup.classList.remove("show");

  void eventPopup.offsetWidth;

  eventPopup.classList.add("show");

  setTimeout(() => {
    eventPopup.classList.remove("show");
    eventPopup.classList.add("hidden");

    currentIndex++;
    renderCurrentLine();
  }, 1800);
}

// ===============================
// 대사 출력
// ===============================

function renderCurrentLine() {
  isWaitingChoice = false;
  choiceBox.innerHTML = "";

  if (currentIndex >= currentScript.length) {
    speakerName.textContent = "";
    dialogueText.textContent = "[ Chapter.1 조명이 밝은 밤 종료 ]";
    saveGame();
    return;
  }

  const line = currentScript[currentIndex];

  if (line.type === "title") {
    chapterTitle.textContent = line.text;
    currentIndex++;
    renderCurrentLine();
    return;
  }
  if (line.type === "nameInput") {
  showScreen(nameScreen);
  return;
}

if (line.type === "event") {
  speakerName.textContent = "";
  dialogueText.textContent = "";
  choiceBox.innerHTML = "";

  showEventPopup(replacePlayerName(line.text));
  return;
}

  if (line.type === "narration") {
    speakerName.textContent = "";
    typeText(replacePlayerName(line.text));
  }

  if (line.type === "dialogue") {
    speakerName.textContent = getCharacterName(line.speaker);
    speakerName.style.color = getCharacterColor(line.speaker);
    typeText(replacePlayerName(line.text));
  }
 
  if (line.type === "task") {
    dialogueText.textContent = line.text || "【목록】이 갱신되었습니다.";
    currentIndex++;
    saveGame();
    return;
  }

  if (line.type === "choice") {
    renderChoice(line);
    return;
  }

  saveGame();
}

// ===============================
// 선택지 출력
// ===============================

function renderChoice(line) {
  isWaitingChoice = true;

  speakerName.textContent = "";
  dialogueText.textContent = line.text || "어떻게 할까?";
  choiceBox.innerHTML = "";

  line.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.textContent = `< ${choice.label} >`;

    button.addEventListener("click", () => {
      isWaitingChoice = false;

      const nextLines = choice.result || [];

      currentScript.splice(currentIndex + 1, 0, ...nextLines);

      currentIndex++;
      choiceBox.innerHTML = "";
      renderCurrentLine();
    });

    choiceBox.appendChild(button);
  });

  saveGame();
}

// ===============================
// 다음 대사로 이동
// ===============================

function nextLine() {
  if (isWaitingChoice) return;

  if (isTyping) {
    showFullText();
    return;
  }

  currentIndex++;
  renderCurrentLine();
}

// ===============================
// 게임 시작
// ===============================

function startNewGame() {
  localStorage.removeItem(SAVE_KEY);

  playerName = "플레이어";
  currentIndex = 0;
  currentScript = CHAPTER_1;

  showScreen(playScreen);
  renderCurrentLine();
}

function confirmName() {
  const inputValue = nameInput.value.trim();

  if (inputValue.length > 0) {
    playerName = inputValue;
  } else {
    playerName = "플레이어";
  }

  currentIndex++;

  showScreen(playScreen);
  renderCurrentLine();
}

// ===============================
// 버튼 이벤트
// ===============================

startButton.addEventListener("click", startNewGame);

continueButton.addEventListener("click", loadGame);

nameConfirmButton.addEventListener("click", confirmName);

dialogueBox.addEventListener("click", nextLine);

taskButton.addEventListener("click", () => {
  taskPanel.classList.remove("hidden");
});

closeTaskButton.addEventListener("click", () => {
  taskPanel.classList.add("hidden");
});

saveButton.addEventListener("click", () => {
  saveGame();
  alert("저장되었습니다.");
});

titleButton.addEventListener("click", () => {
  showScreen(titleScreen);
});

// ===============================
// 처음 실행 시
// ===============================

if (!hasSaveData()) {
  continueButton.disabled = true;
}
