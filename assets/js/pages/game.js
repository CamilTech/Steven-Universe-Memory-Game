// Este arquivo contém a lógica do jogo da memória para Steven Universe.
// Inclui funcionalidades para modo single player e multiplayer, com seleção de personagens.

// Seleção de elementos do DOM para o grid, timer, jogador e modo de jogo
const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');

const spanPlayer = document.querySelector('.player');
const gameMode = localStorage.getItem('gameMode');
const player1Name = localStorage.getItem('player1');
const player2Name = localStorage.getItem('player2');

// area de jogo 
const gameArea = document.querySelector('.game-area');

// pega o nome dos jogadores
const p1El = document.getElementById('p1');
const p2El = document.getElementById('p2');

// imagem dos personagens dos jogadores
const p1Img = document.getElementById('p1-img');
const p2Img = document.getElementById('p2-img');

// personagens que cada jogador escolheu
const char1 = localStorage.getItem('char1');
const char2 = localStorage.getItem('char2');

// Elementos de áudio
const musicaAudio = document.getElementById('musica');
const btnMusica = document.getElementById('btnMusica');
let soundtrackReady = false;
let currentTrack = 'love';

// Dados dos personagens, incluindo cor e imagem
const charactersData = {
  steven: {
    color: "#FF77C6",
    img: "../../../Elementos/imagens/cartas/season1/steven.png"
  },
  garnet: {
    color: "#8F0004",
    img: "../../../Elementos/imagens/cartas/season1/garnet.png"
  },
  perola: {
    color: "#82E8FF",
    img: "../../../Elementos/imagens/cartas/season1/perola.png"
  },
  ametista: {
    color: "#9700DE",
    img: "../../../Elementos/imagens/cartas/season1/ametista.png"
  }
};

// Lista de personagens disponíveis no jogo
const characters = [
  'ametista', 'biscoito-gatinho', 'connie', 'garnet',
  'greg', 'lars', 'leao', 'perola',
  'sadie', 'steven', 'lapis-lazuli', 'peridot'
];

// Função auxiliar para criar elementos HTML
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Variáveis de estado do jogo
let firstCard = '';
let secondCard = '';
let hasStarted = false;

let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let lockBoard = false;
let loop;

// Função para atualizar o turno no modo multiplayer
const updateTurn = () => {
  const turn = document.getElementById('turn');
  if (turn && gameMode === 'multi') {
    turn.innerHTML = `Turno: ${currentPlayer === 1 ? player1Name : player2Name}`;
  }
}

// Função para verificar se o jogo terminou
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length == 24) {

    clearInterval(loop);

    let result;

    if (gameMode === 'multi') {
      if (player1Score > player2Score) {
        result = `${player1Name} venceu!`;
      } else if (player2Score > player1Score) {
        result = `${player2Name} venceu!`;
      } else {
        result = 'Empate!';
      }
    } else {
      result = `Parabéns ${player1Name} Tempo: ${timer.innerHTML}s!`;
    }

    setTimeout(() => {
      alert(result);
    }, 200);
  }
}

// Função para verificar se as cartas combinam
const checkCards = () => {

  lockBoard = true;

  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter == secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    if (gameMode === 'multi') {
      // Color the matched cards with the current player's color
      const playerChar = currentPlayer === 1 ? char1 : char2;
      const playerColor = charactersData[playerChar]?.color || '#ccc'; // fallback

      firstCard.style.backgroundColor = playerColor;
      secondCard.style.backgroundColor = playerColor;

      firstCard.firstChild.style.opacity = '0.5'; // stronger color filter
      secondCard.firstChild.style.opacity = '0.5';
    }

    if (gameMode === 'multi') {
      if (currentPlayer === 1) {
        player1Score++;
        if (p1El) p1El.innerHTML = `${player1Name}: ${player1Score}`;
      } else {
        player2Score++;
        if (p2El) p2El.innerHTML = `${player2Name}: ${player2Score}`;
      }
    } else {
      player1Score++;
      if (p1El) p1El.innerHTML = `${player1Name}: ${player1Score}`;
    }

    firstCard = '';
    secondCard = '';

    checkEndGame();
    lockBoard = false;

  } else {
    setTimeout(() => {

      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';

      if (gameMode === 'multi') {
        currentPlayer = (currentPlayer === 1) ? 2 : 1;
        updateTurn();
      }

      lockBoard = false;

    }, 800);
  }
}

// Função para revelar uma carta quando clicada
const revealCard = (event) => {

  const card = event.currentTarget; // garante que SEMPRE será a .card

  if (lockBoard) return;

  if (!hasStarted) {
    startTimer();
    hasStarted = true;
  }

  // evita clicar na mesma carta
  if (card.classList.contains('reveal-card')) return;

  if (firstCard === '') {
    card.classList.add('reveal-card');
    firstCard = card;

  } else if (secondCard === '') {
    card.classList.add('reveal-card');
    secondCard = card;
    checkCards();
  }
}

// Função para criar uma carta com frente e verso
const creatCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../../../Elementos/imagens/cartas/season1/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
}

// Função para carregar o jogo, duplicando e embaralhando as cartas
const loadgame = () => {
  const duplicateCharacter = [...characters, ...characters];
  const shuffledArray = duplicateCharacter.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = creatCard(character);
    grid.appendChild(card);
  });
}

// Função para definir a fonte da trilha sonora
const setSoundtrackSource = () => {
  if (!musicaAudio || currentTrack === 'soundtrack') return;
  musicaAudio.src = '../../../Elementos/song/soundtrack.mp3';
  musicaAudio.load();
  currentTrack = 'soundtrack';
  soundtrackReady = true;
};

// Função para iniciar a trilha sonora do jogo
const startGameSoundtrack = () => {
  if (!btnMusica || !musicaAudio) return;
  if (btnMusica.classList.contains('paused')) return;

  setSoundtrackSource();
  musicaAudio.play().catch(() => { });
};

// Função para iniciar o timer
const startTimer = () => {
  loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
}

// Evento onload para inicializar o jogo
window.onload = () => {
  loadgame();

  if (gameMode === 'single') {

    spanPlayer.innerHTML = player1Name;

    if (gameArea) gameArea.classList.remove('multiplayer');

    const turn = document.getElementById('turn');
    if (turn) turn.style.display = 'none';

  } else {

    if (gameArea) gameArea.classList.add('multiplayer');

    if (p1El) p1El.innerHTML = `${player1Name}: 0`;
    if (p2El) p2El.innerHTML = `${player2Name}: 0`;

    updateTurn();
  }

  if (musicaAudio && btnMusica) {
    const liberado = sessionStorage.getItem('musicaLiberada') === 'true';

    if (liberado) {
      btnMusica.classList.remove('paused');
      musicaAudio.play().catch(() => { });
    } else {
      btnMusica.classList.add('paused');
      musicaAudio.pause();
    }

    btnMusica.addEventListener('click', () => {
      if (musicaAudio.paused) {
        setSoundtrackSource();
        musicaAudio.play().catch(() => { });
        btnMusica.classList.remove('paused');
        sessionStorage.setItem('musicaLiberada', 'true');
      } else {
        musicaAudio.pause();
        btnMusica.classList.add('paused');
        sessionStorage.setItem('musicaLiberada', 'false');
      }
    });
  }

  /* aplica personagem Player 1 */
  if (char1 && charactersData[char1]) {
    const data = charactersData[char1];
    const isMobile = window.innerWidth <= 768;
    const iconChar = char1.charAt(0).toUpperCase();
    if (p1Img) p1Img.src = isMobile ? `../../../Elementos/imagens/icon/icon-${iconChar}.png` : data.img;

    const leftBox = document.querySelector('.left');
    if (leftBox) leftBox.style.backgroundColor = data.color;
  }

  /* aplica personagem Player 2 */
  if (gameMode === 'multi' && char2 && charactersData[char2]) {
    const data = charactersData[char2];
    const isMobile = window.innerWidth <= 768;
    const iconChar = char2.charAt(0).toUpperCase();
    if (p2Img) p2Img.src = isMobile ? `../../../Elementos/imagens/icon/icon-${iconChar}.png` : data.img;

    const rightBox = document.querySelector('.right');
    if (rightBox) rightBox.style.backgroundColor = data.color;
  }

  // Listener para mudança de tamanho da tela
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    if (char1 && p1Img) {
      const data = charactersData[char1];
      const iconChar = char1.charAt(0).toUpperCase();
      p1Img.src = isMobile ? `../../../Elementos/imagens/icon/icon-${iconChar}.png` : data.img;
    }
    if (gameMode === 'multi' && char2 && p2Img) {
      const data = charactersData[char2];
      const iconChar = char2.charAt(0).toUpperCase();
      p2Img.src = isMobile ? `../../../Elementos/imagens/icon/icon-${iconChar}.png` : data.img;
    }
  });
}