(() => {
  // Select elements

  const select = name => document.querySelector(`.game-board__${name}`);

  const categoryDisp = select("category-display");
  const wrongLetters = select("wrong-letters");
  const input = select("input");
  const submitBtn = select("submit-btn");
  const livesDisp = select("lives-value");
  const popup = select("popup");
  const popupAnswer = select("popup-answer");
  const overlay = select("overlay");
  const yesBtn = document.querySelector(`button[data-confirm="yes"]`);
  const noBtn = document.querySelector(`button[data-confirm="no"]`);
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

  const getWordList = () => {
    return fetch(wordListURL).then(res => res.json());
  };

  // Randomly pick a word and remove it from wordList

  const getRandomWord = list => {
    let randomWord = list.splice([Math.floor(Math.random() * list.length)], 1);
    wordList = list;
    word = randomWord[0].clue.split("");
    category = randomWord[0].category;
    return word;
  };

  // Create underscores based on picked word length

  const displayUnderscores = word => {
    word.forEach(
      () => (lettersList.innerHTML += `<li class="game-board__letters">_</li>`)
    );
    lettersListElements = document.querySelectorAll(".game-board__letters");
  };

  const displayCategory = () => {
    categoryDisp.textContent = ` ${category}`;
  };

  const drawHangman = nr => gallows.children[nr].classList.remove("hide");

  const toggleHideClass = node => {
    node.classList.contains("hide")
      ? node.classList.remove("hide")
      : node.classList.add("hide");
  };

  const toggleDisableElement = node => {
    !node.disabled ? (node.disabled = true) : (node.disabled = false);
  };

  // Clear board

  const clearBoard = () => {
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
  };

  //Prepare board

  const prepareBoard = () => {
    getWordList()
      .then(getRandomWord)
      .then(displayUnderscores)
      .then(displayCategory);
  };

  const newRound = () => {
    clearBoard();
    toggleHideClass(popup);
    toggleHideClass(overlay);
    toggleDisableElement(input);
    getRandomWord(wordList);
    displayUnderscores(word);
    displayCategory();
  };

  submitBtn.addEventListener("click", e => {
    e.preventDefault();
    if (input.value.length !== 0) {
      currentGuess = input.value.toLowerCase().split("");
      input.value = "";
      checkGuess();
      input.focus();
    }
  });

  // Handle popup

  yesBtn.addEventListener("click", () => newRound());
  noBtn.addEventListener("click", () => {
    popup.innerHTML = `
  <p class="game-board__popup-paragraph" style="margin-bottom: 0">Thank you for playing</p>
  `;
  });

  const handlePopup = result => {
    toggleHideClass(overlay);
    toggleHideClass(popup);
    popupAnswer.textContent = word.join("").toUpperCase();
    result
      ? (popup.children[0].textContent = "Congratulations, you won!")
      : (popup.children[0].textContent = "You lost...");
  };

  // Check if guess is right

  const checkGuess = () => {
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
        drawHangman(lives);
        livesDisp.textContent = lives;
        if (lives === 0) {
          toggleDisableElement(input);
          handlePopup(false);
        }
      }
      if (rightGuessCount === word.length) {
        toggleDisableElement(input);
        handlePopup(true);
      }
    });
  };

  prepareBoard();
})();
