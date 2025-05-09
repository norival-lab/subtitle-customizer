# Udemy Subtitle Styler

Uma extensão simples para personalizar o estilo das legendas nos vídeos da Udemy. Este script permite alterar a cor do texto, sombra, fundo e centralizar o texto das legendas, sem modificar o tamanho ou a posição da caixa de legendas.

## Funcionalidades

- **Cor do texto:** Altere a cor das legendas para amarelo.
- **Sombra do texto:** Adicione uma sombra preta para melhorar a visibilidade.
- **Fundo semi-transparente:** Adicione um fundo discreto para destacar as legendas.
- **Centralização do texto:** Centralize o texto dentro da caixa de legendas.

## Como Funciona

O script utiliza JavaScript para injetar estilos CSS diretamente na página da Udemy. Ele também utiliza um `MutationObserver` para monitorar mudanças no DOM e reaplicar os estilos automaticamente, garantindo que as legendas permaneçam estilizadas mesmo em tela cheia ou após alterações dinâmicas na página.

## Instalação

1. Clone este repositório ou baixe os arquivos.
2. Abra o navegador Google Chrome.
3. Acesse `chrome://extensions/`.
4. Ative o **Modo do desenvolvedor** no canto superior direito.
5. Clique em **Carregar sem compactação** e selecione a pasta do projeto.
6. Acesse um curso na Udemy e veja as legendas estilizadas automaticamente.

## Estrutura do Projeto

- **`content.js`:** Contém o código principal que aplica os estilos às legendas.
- **`manifest.json`:** Arquivo de configuração da extensão.

## Exemplo de Estilo Aplicado

- **Texto:** Amarelo com sombra preta.
- **Fundo:** Semi-transparente.
- **Centralização:** Texto centralizado dentro da caixa de legendas.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

---

**Nota:** Este projeto é apenas para uso pessoal e educativo. Certifique-se de respeitar os termos de serviço da Udemy ao usar esta extensão.
