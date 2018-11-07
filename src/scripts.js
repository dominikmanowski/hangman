// Select elements
const select = name => document.querySelector(`.game-board__${name}`);

const categoryDisp = select("category-display");
const wordToGuess = select("word-to-guess");
const wrongLetters = select("wrong-letters");
const input = select("input");
const submitBtn = select("submit-btn");
const livesDisp = select("lives-value");
let lettersList = select("letters-list");
let gallows = select("gallows");
let lettersListElements;


// Define needed variables

let lives = 6;

let wordList;
let word = [];
let category = "";
let currentGuess = "";
let rightGuessCount = 0;
let rightLettersArr = [];
let wrongLettersArr = [];

const wordListURL = "https://hangman-game-823e7.firebaseio.com/list.json";

// Get list word

function getWordList() {
  return fetch(wordListURL).then(res => res.json());
}

// Randomly pick a word and remove it from wordList

function getRandomWord(list) {
  let randomWord = list.splice([Math.floor(Math.random() * list.length)], 1);
  wordList = list;
  word = randomWord[0].clue.split("");
  category = randomWord[0].category;
  return word;
}

// Create underscores based on picked word length

function displayUnderscores(word) {
  word.forEach(
    () => (lettersList.innerHTML += `<li class="game-board__letters">_</li>`)
    );
    lettersListElements = document.querySelectorAll(".game-board__letters");
  }
  
  function displayCategory() {
    categoryDisp.textContent = ` ${category}`;
  }
  
  function drawHangman(nr){
    gallows.children[nr].classList.remove("hide");
  }
  
  // Clear board
  
  function clearBoard() {
    lives = 6;
    livesDisp.textContent = lives;
    rightGuessCount = 0;
    rightLettersArr = [];
    wrongLettersArr = [];
    wrongLetters.textContent = "Wrong letters:";
    while (lettersList.firstChild) {
      lettersList.removeChild(lettersList.firstChild);
    }
    for (let i = 0; i < lives; i++) {
      gallows.children[i].classList.add("hide");
    }
  }
  
  //Prepare board
  
  function prepareBoard() {
    clearBoard();
    getWordList()
    .then(getRandomWord)
    .then(displayUnderscores)
    .then(displayCategory);
  }
  
  function newRound() {
    clearBoard();
    getRandomWord(wordList);
    displayUnderscores(word);
    displayCategory();
  }
  
  (() => {
    prepareBoard();
  })();
  
  function removeWhitespaces(array){
    return array.filter((item) => item != ' ');
  }

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    if (input.value && input.value.trim()) {
      currentGuess = removeWhitespaces(input.value.toLowerCase().split(''));
      input.value = "";
      checkGuess();
      input.focus();
  }
});

// Check if guess is right

function checkGuess() {
  currentGuess.forEach(char => {
    if (word.includes(char)) {
      word.forEach((letter, i) => {
        if (letter === char && !rightLettersArr.includes(char)) {
          lettersListElements[i].textContent = char.toUpperCase();
          rightGuessCount++;
        }
      });
      rightLettersArr.push(char);
    } else if (!wrongLettersArr.includes(char)) {
      wrongLetters.textContent += ` ${char.toUpperCase()}`;
      wrongLettersArr.push(char);
      lives--;
      drawHangman(lives)
      livesDisp.textContent = lives;
      if (lives === 0) {
        setTimeout(() => {
          if (confirm("You lost. Do you want to play again?")) {
            newRound();
          }
        }, 200);
      }
    }
    if (rightGuessCount === word.length) {
      setTimeout(() => {
        if (confirm("You won! Do you want to play again?")) {
          newRound();
        }
      }, 200);
    }
  })
}
