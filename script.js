const button = document.querySelector('#meu-botao');
const container = document.querySelector('.container');
const div = document.querySelector('div');
const statusHeading = document.querySelector('h1');

function updateButtonText() {
  if (!button) return;
  button.textContent = document.body.classList.contains('dark-mode')
    ? 'Ativar modo claro'
    : 'Ativar modo escuro';
}

function updateStatusHeading() {
  if (!statusHeading) return;
  statusHeading.textContent = document.body.classList.contains('dark-mode')
    ? 'Modo claro desativado'
    : 'Modo escuro desativado';
}

if (button) {
  updateButtonText(); // sincroniza texto inicial
  updateStatusHeading(); // sincroniza heading inicial

  button.addEventListener("click", () => {
    document.body.classList.toggle('dark-mode');
    if (div) div.classList.toggle('ocultarElemento');

    updateButtonText();
    updateStatusHeading();

    if (div && div.classList.contains('ocultarElemento')) {
      alert('O elemento foi ocultado!');
    }
  });
} else {
  console.warn('#meu-botao não encontrado no DOM.');
}