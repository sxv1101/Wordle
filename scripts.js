let word = [];
let guessRows = document.querySelectorAll(".guess-row");
let currGuess = 0;
let currBox = guessRows[currGuess].querySelectorAll(".guess-box");
let gameOver = false;
const ANSWER_LENGTH = 5;
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function isFiveLetters() {
  if (word.length == ANSWER_LENGTH) {
    return true;
  } else {
    return false;
  }
}

function deleteLetter() {
  currBox[word.length - 1].innerText = "";
  word.pop();
}

function testStuff(string) {
  currBox[word.length - 1].innerText = string.toUpperCase();
}

async function checkWord() {
  let dailyWord = await getWord();
  const validateWord = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: word.join("") }),
  });
  const processedResponse = await validateWord.json();
  if (processedResponse.validWord) {
    verifyWord(dailyWord);
    word = [];
  }
}

async function getWord() {
  const getWord = await fetch("https://words.dev-apis.com/word-of-the-day");
  const text = await getWord.json();
  return text.word;
}

function verifyWord(dailyWord) {
  dailyWord = dailyWord.split("");
  const map = makeMap(dailyWord);
  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (word[i] == dailyWord[i]) {
      currBox[i].style.backgroundColor = "green";
      map[word[i]]--;
    }
  }

  for (let i = 0; i < ANSWER_LENGTH; i++) {
    if (word[i] == dailyWord[i]) {
    } else if (dailyWord.includes(word[i]) && map[word[i] != 0]) {
      currBox[i].style.backgroundColor = "#daa520";
      map[word[i]]--;
    } else {
      currBox[i].style.backgroundColor = "gray";
    }
  }

  dailyWord = dailyWord.join("");
  if (dailyWord == word.join("")) {
    gameOver = true;
    alert("win");
  } else {
    currGuess += 1;
    if (currGuess >= guessRows.length) {
      gameOver = true;
      alert("lose");
    } else {
      currBox = guessRows[currGuess].querySelectorAll(".guess-box");
    }
  }
}

function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }
  return obj;
}

function init() {
  window.addEventListener("keydown", async function (event) {
    const action = event.key;
    if (gameOver) {
      return;
    }
    if (action == "Backspace") {
      if (!word.length == 0) {
        deleteLetter();
      }
    }
    if (action == "Enter") {
      if (isFiveLetters()) {
        await checkWord();
      }
    }

    if (isLetter(action)) {
      if (!isFiveLetters()) {
        word.push(action);
        testStuff(action);
      } else {
        word[word.length - 1] = action;
        testStuff(action);
      }
    }
  });
}

init();
