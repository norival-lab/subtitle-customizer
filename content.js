// Função para aplicar o estilo nas legendas
function changeSubtitleColor() {
  console.log('Aplicando estilos às legendas...');
  const styleId = 'subtitle-color-style';

  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      .vjs-text-track-display span,
      .captions-text,
      .ud-video-player--captions-text--,
      div[class^="captions-display--captions-cue-text--"] {
        color: #ffff00 !important;              /* Cor do texto */
        background: rgba(0, 0, 0, 0.0) !important; /* Fundo semi-transparente */
        text-shadow: 2px 2px 4px #000 !important; /* Sombra do texto */
        font-weight: bold !important;           /* Negrito no texto */
        text-align: center !important;          /* Centraliza o texto */
      }
    `;
    document.head.appendChild(style);
    console.log('Estilos adicionados ao <head>.');
  } else {
    console.log('Estilos já aplicados.');
  }
}

changeSubtitleColor();
const observer = new MutationObserver((mutations) => {
  console.log('Mudança detectada no DOM:', mutations);
  changeSubtitleColor();
});
observer.observe(document.body, { childList: true, subtree: true });
