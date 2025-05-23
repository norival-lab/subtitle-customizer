// content.js

// Seletores comuns para legendas na Udemy
const subtitleSelectors = [
  '.vjs-text-track-display > div > div > span',
  '.captions-text',
  '.ud-video-player--captions-text--',
  'div[class^="captions-display--captions-cue-text--"]',
  '[data-purpose="captions-cue-text"]',
];

const HIDING_CLASS_FOR_UDEMY_CONTENT = 'udemy-subtitle-original-hidden';
const STYLE_ID = 'dynamic-udemy-subtitle-style-v2';

// Definições padrão - devem corresponder às do popup.js
const defaultSettings = {
  fontSize: 1.3,
  bgColorAlpha: 0.3,
  fontColor: '#ffff00',
  textAlign: 'center',
  translationEnabled: true,
  targetLanguage: 'pt',
  verticalPosition: 0, // NOVO - Posição vertical padrão em pixels
};

let currentSettings = { ...defaultSettings };

// Função para aplicar/atualizar os estilos dinamicamente
function applyDynamicStyles(settings) {
  // console.log('[CONTENT_SCRIPT] Aplicando estilos com configurações:', settings);
  currentSettings = settings; // Atualiza as configurações atuais com as recebidas

  let styleElement = document.getElementById(STYLE_ID);
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = STYLE_ID;
    document.head.appendChild(styleElement);
  }

  const backgroundColorRgba = `rgba(0, 0, 0, ${settings.bgColorAlpha.toFixed(2)})`;
  // NOVO: Converte a posição vertical para pixels
  const verticalPositionPx = `${settings.verticalPosition}px`;
  let cssText = '';

  if (settings.translationEnabled) {
    // console.log('[STYLE] Modo Tradução ATIVADA');
    cssText = `
      /* Classe para ocultar o conteúdo original do container da Udemy */
      .${HIDING_CLASS_FOR_UDEMY_CONTENT},
      .${HIDING_CLASS_FOR_UDEMY_CONTENT} > span:not(.translated-subtitle-text):not(.original-subtitle-text) {
        color: transparent !important;
        text-shadow: none !important;
        background-color: transparent !important;
      }

      /* Nosso span para guardar o texto original (que será traduzido) - SEMPRE OCULTO */
      .original-subtitle-text {
        display: none !important;
      }

      /* Nosso span para o texto TRADUZIDO - com estilos dinâmicos */
      .translated-subtitle-text {
        color: ${settings.fontColor} !important;
        font-size: ${settings.fontSize}em !important;
        font-weight: bold !important;
        text-shadow: 2px 2px 3px rgba(0,0,0,0.9) !important;
        display: block !important;
        line-height: 1.4 !important;
        padding: 0.2em 0.4em !important;
        background: ${backgroundColorRgba} !important;
        margin-bottom: 5px !important; /* Mantém a margem inferior original */
        border-radius: 4px;
        visibility: hidden; /* Começa oculto, JS torna visível após tradução */
        text-align: ${settings.textAlign} !important;
        position: relative !important; /* NOVO: Para permitir ajuste com 'bottom' */
        bottom: ${verticalPositionPx} !important; /* NOVO: Ajuste vertical */
      }
    `;
  } else {
    // Tradução está DESLIGADA - Estilizar legendas originais da Udemy
    // console.log('[STYLE] Modo Tradução DESATIVADA');
    const udemySelectorsDirectStyle = subtitleSelectors.map((sel) => `${sel}, ${sel} > span, ${sel} span`).join(',\n');

    cssText = `
      /* Garante que nossos spans customizados estejam completamente ocultos */
      .original-subtitle-text,
      .translated-subtitle-text {
        display: none !important;
        visibility: hidden !important;
      }

      /* Remove a classe de ocultação se existir, para mostrar o conteúdo original da Udemy */
      .${HIDING_CLASS_FOR_UDEMY_CONTENT} {
        color: inherit !important;
        text-shadow: inherit !important;
        background-color: inherit !important;
      }

      /* Estiliza diretamente os elementos de legenda da Udemy */
      ${udemySelectorsDirectStyle} {
        color: ${settings.fontColor} !important;
        font-size: ${settings.fontSize}em !important;
        font-weight: bold !important;
        text-shadow: 2px 2px 3px rgba(0,0,0,0.9) !important;
        background: ${backgroundColorRgba} !important;
        text-align: ${settings.textAlign} !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        line-height: 1.4 !important;
        padding: 0.2em 0.4em !important;
        border-radius: 4px;
        margin-bottom: 5px !important; /* Mantém a margem inferior original */
        /* position: static !important;  REMOVIDO: Para permitir o 'relative' abaixo */
        position: relative !important; /* NOVO: Para permitir ajuste com 'bottom' */
        bottom: ${verticalPositionPx} !important; /* NOVO: Ajuste vertical */
      }
    `;
  }
  styleElement.innerHTML = cssText;
  // console.log('[CONTENT_SCRIPT] Estilos dinâmicos (v2) aplicados/atualizados.');
}

// Função para traduzir o texto
async function translateText(text, targetLang) {
  if (!text || !text.trim() || text.trim() === '...' || text.trim() === '\u00A0') {
    return null;
  }
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
    text,
  )}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const jsonResponse = await response.json();
    if (jsonResponse && jsonResponse[0] && jsonResponse[0][0] && jsonResponse[0][0][0]) {
      return jsonResponse[0][0][0];
    } else if (jsonResponse && jsonResponse[0]) {
      return jsonResponse[0].map((segment) => segment[0]).join('');
    }
    return null;
  } catch (error) {
    return null;
  }
}

// Função principal para processar e traduzir as legendas
function processSubtitles() {
  // console.log('[SUBTITLE DEBUG] processSubtitles. Tradução Ativada:', currentSettings.translationEnabled);

  document.querySelectorAll(subtitleSelectors.join(', ')).forEach(async (element) => {
    if (
      element.classList.contains('original-subtitle-text') ||
      element.classList.contains('translated-subtitle-text')
    ) {
      return;
    }

    if (currentSettings.translationEnabled) {
      if (
        !element.classList.contains(HIDING_CLASS_FOR_UDEMY_CONTENT) &&
        !element.querySelector('.translated-subtitle-text')
      ) {
        element.classList.add(HIDING_CLASS_FOR_UDEMY_CONTENT);
      }

      if (element.offsetParent === null) {
        if (element.dataset.translationInProgress || element.dataset.originalTextForTranslation) {
          delete element.dataset.originalTextForTranslation;
          delete element.dataset.translationInProgress;
          delete element.dataset.finalTextContent;
          const existingTranslatedSpan = element.querySelector('.translated-subtitle-text');
          if (existingTranslatedSpan && existingTranslatedSpan.style.visibility !== 'hidden') {
            existingTranslatedSpan.style.visibility = 'hidden';
          }
        }
        return;
      }

      let originalSpan = element.querySelector('.original-subtitle-text');
      let translatedSpan = element.querySelector('.translated-subtitle-text');

      if (!originalSpan || !translatedSpan || element.dataset.hasDualStructure !== 'true') {
        const currentTextContent = element.textContent.trim();
        element.innerHTML = '';

        originalSpan = document.createElement('span');
        originalSpan.className = 'original-subtitle-text';
        originalSpan.textContent = currentTextContent || '\u00A0';

        translatedSpan = document.createElement('span');
        translatedSpan.className = 'translated-subtitle-text';

        element.appendChild(originalSpan);
        element.appendChild(translatedSpan);
        element.dataset.hasDualStructure = 'true';
      }

      if (!originalSpan || !element.contains(originalSpan)) {
        originalSpan = element.querySelector('.original-subtitle-text');
        if (!originalSpan) return;
      }
      if (!translatedSpan || !element.contains(translatedSpan)) {
        translatedSpan = element.querySelector('.translated-subtitle-text');
        if (!translatedSpan) return;
      }

      const textToTranslate = originalSpan.textContent.trim();

      if (
        !textToTranslate ||
        textToTranslate === '\u00A0' ||
        (element.dataset.originalTextForTranslation === textToTranslate && element.dataset.finalTextContent) ||
        element.dataset.processingInProgress === textToTranslate
      ) {
        if (element.dataset.finalTextContent && translatedSpan && translatedSpan.style.visibility === 'hidden') {
          if (translatedSpan.textContent && translatedSpan.textContent.trim() !== '\u00A0') {
            translatedSpan.style.visibility = 'visible';
          }
        } else if ((!textToTranslate || textToTranslate === '\u00A0') && translatedSpan) {
          if (translatedSpan.style.visibility !== 'hidden') {
            translatedSpan.style.visibility = 'hidden';
          }
        }
        return;
      }

      element.dataset.originalTextForTranslation = textToTranslate;
      element.dataset.processingInProgress = textToTranslate;
      delete element.dataset.finalTextContent;

      if (translatedSpan && translatedSpan.style.visibility !== 'hidden') {
        translatedSpan.style.visibility = 'hidden';
      }

      const translatedText = await translateText(textToTranslate, currentSettings.targetLanguage);

      if (
        !document.body.contains(element) ||
        !element.contains(originalSpan) ||
        !element.contains(translatedSpan) ||
        element.dataset.processingInProgress !== textToTranslate
      ) {
        if (element.dataset.processingInProgress === textToTranslate) {
          delete element.dataset.processingInProgress;
        }
        return;
      }

      if (translatedText && translatedText.trim()) {
        translatedSpan.textContent = translatedText;
        translatedSpan.style.visibility = 'visible';
        element.dataset.finalTextContent = translatedText;
      } else {
        translatedSpan.textContent = textToTranslate === '\u00A0' ? '\u00A0' : textToTranslate;
        translatedSpan.style.visibility = textToTranslate && textToTranslate !== '\u00A0' ? 'visible' : 'hidden';
        element.dataset.finalTextContent = textToTranslate;
      }
      delete element.dataset.processingInProgress;
    } else {
      if (element.classList.contains(HIDING_CLASS_FOR_UDEMY_CONTENT)) {
        element.classList.remove(HIDING_CLASS_FOR_UDEMY_CONTENT);
      }
      const existingOriginalSpan = element.querySelector('.original-subtitle-text');
      if (existingOriginalSpan) {
        element.innerHTML = '';
      }
      delete element.dataset.hasDualStructure;
      delete element.dataset.originalTextForTranslation;
      delete element.dataset.finalTextContent;
      delete element.dataset.processingInProgress;
    }
  });
}

const debouncedProcessSubtitles = (() => {
  let timeoutId;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      processSubtitles();
    }, 150);
  };
})();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'UDEMY_SUBTITLE_SETTINGS_UPDATED') {
    const oldTranslationState = currentSettings.translationEnabled;
    // Primeiro, atualiza currentSettings com as novas configurações recebidas
    currentSettings = { ...currentSettings, ...request.settings };

    applyDynamicStyles(currentSettings); // Aplica os estilos com as configurações já atualizadas

    if (oldTranslationState !== currentSettings.translationEnabled) {
      document.querySelectorAll(subtitleSelectors.join(', ')).forEach((el) => {
        if (el.dataset.hasDualStructure === 'true') {
          const originalTextContainer = el.querySelector('.original-subtitle-text');
          el.innerHTML = originalTextContainer ? originalTextContainer.textContent || '' : '';
          if (el.innerHTML === '\u00A0') el.innerHTML = '';
        }
        delete el.dataset.hasDualStructure;
        delete el.dataset.originalTextForTranslation;
        delete el.dataset.finalTextContent;
        delete el.dataset.processingInProgress;
        if (el.classList.contains(HIDING_CLASS_FOR_UDEMY_CONTENT)) {
          el.classList.remove(HIDING_CLASS_FOR_UDEMY_CONTENT);
        }
      });
    }
    debouncedProcessSubtitles();
    sendResponse({ status: 'Estilos e configurações atualizados.' });
    return true;
  }
});

function initialize() {
  chrome.storage.sync.get(defaultSettings, (settingsFromStorage) => {
    // Mescla as configurações do storage com as default, dando prioridade às do storage
    currentSettings = { ...defaultSettings, ...settingsFromStorage };
    applyDynamicStyles(currentSettings);

    setTimeout(() => {
      debouncedProcessSubtitles();
    }, 1500);

    const observer = new MutationObserver((mutationsList) => {
      let relevantChangeDetected = false;
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (subtitleSelectors.some((selector) => node.matches && node.matches(selector))) {
                relevantChangeDetected = true;
                break;
              }
              const parentContainer = node.parentElement
                ? node.parentElement.closest(subtitleSelectors.join(','))
                : null;
              if (
                parentContainer &&
                !node.classList.contains('original-subtitle-text') &&
                !node.classList.contains('translated-subtitle-text')
              ) {
                relevantChangeDetected = true;
                break;
              }
            }
          }
          if (!relevantChangeDetected && mutation.removedNodes.length > 0) {
            for (const node of mutation.removedNodes) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                if (
                  subtitleSelectors.some((selector) => node.matches && node.matches(selector)) ||
                  (node.parentElement && subtitleSelectors.some((selector) => node.parentElement.closest(selector))) ||
                  node.classList.contains('original-subtitle-text') ||
                  node.classList.contains('translated-subtitle-text')
                ) {
                  relevantChangeDetected = true;
                  break;
                }
              }
            }
          }
        }

        if (!relevantChangeDetected && mutation.type === 'characterData') {
          const targetNode = mutation.target;
          const parentElement = targetNode.parentElement;
          if (parentElement) {
            const mainContainer = parentElement.closest(subtitleSelectors.join(', '));
            if (mainContainer) {
              relevantChangeDetected = true;
              if (mainContainer.dataset) {
                delete mainContainer.dataset.originalTextForTranslation;
                delete mainContainer.dataset.finalTextContent;
                delete mainContainer.dataset.processingInProgress;
                const ts = mainContainer.querySelector('.translated-subtitle-text');
                if (ts && ts.style.visibility !== 'hidden') {
                  ts.style.visibility = 'hidden';
                }
              }
            }
          }
        }
      }

      if (relevantChangeDetected) {
        debouncedProcessSubtitles();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
}

initialize();
// console.log('[SUBTITLE] Extensão ATIVA com estilização direta da legenda original (quando tradução desligada).');
