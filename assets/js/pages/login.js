// Este arquivo gerencia a tela de login, incluindo seleção de modo de jogo e personagens.

// Seleção de elementos do DOM para inputs, botões e formulário
const input1 = document.getElementById('player1');
const input2 = document.getElementById('player2');
const button = document.querySelector('.login-btn');
const form = document.querySelector('.login-form');

const singleBtn = document.getElementById('singleBtn');
const multiBtn = document.getElementById('multiBtn');

/* Personagens selecionados */
const charSelect = document.getElementById('charSelect');
let selectedChar1 = null;
let selectedChar2 = null;

// modo padrão de jogo é single player
let gameMode = 'single';

// Função para validar os inputs e habilitar o botão
const validateInput = () => {

  if (gameMode === 'single') {
    if (input1.value.length > 2) {
      button.removeAttribute('disabled');
      return;
    }
  } else {
    if (
      input1.value.length > 2 &&
      input2.value.length > 2 &&
      selectedChar1 &&
      selectedChar2
    ) {
      button.removeAttribute('disabled');
      return;
    }
  }

  button.setAttribute('disabled', '');
}

// Evento para botão single player
singleBtn.addEventListener('click', () => {
  gameMode = 'single';
  input2.style.display = 'none';
  charSelect.style.display = 'none'; //

  validateInput();
});

// Evento para botão multiplayer
multiBtn.addEventListener('click', () => {
  gameMode = 'multi';
  input2.style.display = 'block';
  charSelect.style.display = 'block'; //

  validateInput();
});

// Seleção de personagens
const charButtons = document.querySelectorAll('.char-btn');

charButtons.forEach(btn => {
  btn.addEventListener('click', () => {

    const player = btn.dataset.player;

    document
      .querySelectorAll(`.char-btn[data-player="${player}"]`)
      .forEach(b => b.classList.remove('selected'));

    btn.classList.add('selected');

    if (player === "1") {
      selectedChar1 = btn.dataset.char;
    } else {
      selectedChar2 = btn.dataset.char;
    }

    validateInput();
  });
});

// Função para lidar com o submit do formulário
const handleSubmit = (e) => {
  e.preventDefault();

  localStorage.setItem('gameMode', gameMode);
  localStorage.setItem('player1', input1.value);

  if (gameMode === 'multi') {
    localStorage.setItem('player2', input2.value);
    localStorage.setItem('char1', selectedChar1); //
    localStorage.setItem('char2', selectedChar2); //
  }

  window.location = 'assets/css/pages/game/game.html';
}

// Adiciona event listeners para inputs
input1.addEventListener('input', validateInput);
input2.addEventListener('input', validateInput);
form.addEventListener('submit', handleSubmit);

// Controle da música
const musica = document.getElementById("musica");
const botao = document.getElementById("btnMusica");

let tocando = false;

botao.classList.add("paused");

botao.addEventListener("click", () => {
  if (!tocando) {
    musica.play();
    botao.classList.remove("paused");
    tocando = true;
  } else {
    musica.pause();
    botao.classList.add("paused");
    tocando = false;
  }

  // libera para outras páginas
  sessionStorage.setItem("musicaLiberada", "true");
});