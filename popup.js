// popup.js

// Elementos do DOM
const fontSizeInput = document.getElementById('fontSize');
const bgColorAlphaInput = document.getElementById('bgColorAlpha');
const bgColorAlphaValueDisplay = document.getElementById('bgColorAlphaValue');
const fontColorInput = document.getElementById('fontColor');
const textAlignSelect = document.getElementById('textAlign');
const translationEnabledInput = document.getElementById('translationEnabled');
const targetLanguageSelect = document.getElementById('targetLanguage');
const verticalPositionInput = document.getElementById('verticalPosition'); // NOVO
const verticalPositionValueDisplay = document.getElementById('verticalPositionValue'); // NOVO

// Definições padrão
const defaultSettings = {
  fontSize: 1.3,
  bgColorAlpha: 0.3,
  fontColor: '#ffff00',
  textAlign: 'center',
  translationEnabled: true,
  targetLanguage: 'pt',
  verticalPosition: 0, // NOVO - Posição vertical padrão em pixels
};

// Função para ativar/desativar o seletor de idioma com base no interruptor
function toggleLanguageSelector() {
  targetLanguageSelect.disabled = !translationEnabledInput.checked;
  targetLanguageSelect.style.opacity = translationEnabledInput.checked ? '1' : '0.6';
  targetLanguageSelect.style.cursor = translationEnabledInput.checked ? 'pointer' : 'not-allowed';
}

// Carrega as configurações guardadas quando o popup é aberto
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(defaultSettings, (settings) => {
    fontSizeInput.value = settings.fontSize;
    bgColorAlphaInput.value = Math.round(settings.bgColorAlpha * 100);
    bgColorAlphaValueDisplay.textContent = `${bgColorAlphaInput.value}%`;
    fontColorInput.value = settings.fontColor;
    textAlignSelect.value = settings.textAlign;
    translationEnabledInput.checked = settings.translationEnabled;
    targetLanguageSelect.value = settings.targetLanguage;
    verticalPositionInput.value = settings.verticalPosition; // NOVO
    verticalPositionValueDisplay.textContent = `${settings.verticalPosition}px`; // NOVO
    toggleLanguageSelector();
  });
});

// Função para guardar as configurações e notificar o content script
function saveAndApplySettings() {
  const newSettings = {
    fontSize: parseFloat(fontSizeInput.value) || defaultSettings.fontSize,
    bgColorAlpha: parseInt(bgColorAlphaInput.value, 10) / 100.0,
    fontColor: fontColorInput.value || defaultSettings.fontColor,
    textAlign: textAlignSelect.value || defaultSettings.textAlign,
    translationEnabled: translationEnabledInput.checked,
    targetLanguage: targetLanguageSelect.value || defaultSettings.targetLanguage,
    verticalPosition: parseInt(verticalPositionInput.value, 10) || defaultSettings.verticalPosition, // NOVO
  };

  chrome.storage.sync.set(newSettings, () => {
    // console.log('Configurações guardadas:', newSettings);
    // Envia mensagem para o content script ativo
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: 'UDEMY_SUBTITLE_SETTINGS_UPDATED',
            settings: newSettings,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              // console.warn("Erro ao enviar mensagem:", chrome.runtime.lastError.message);
            }
          },
        );
      }
    });
  });
}

// Event listeners para as mudanças nos inputs
fontSizeInput.addEventListener('change', saveAndApplySettings);

bgColorAlphaInput.addEventListener('input', () => {
  bgColorAlphaValueDisplay.textContent = `${bgColorAlphaInput.value}%`;
  saveAndApplySettings();
});

fontColorInput.addEventListener('input', saveAndApplySettings);
textAlignSelect.addEventListener('change', saveAndApplySettings);

translationEnabledInput.addEventListener('change', () => {
  toggleLanguageSelector();
  saveAndApplySettings();
});

targetLanguageSelect.addEventListener('change', saveAndApplySettings);

// NOVO: Event listener para a posição vertical
verticalPositionInput.addEventListener('input', () => {
  verticalPositionValueDisplay.textContent = `${verticalPositionInput.value}px`;
  saveAndApplySettings();
});
