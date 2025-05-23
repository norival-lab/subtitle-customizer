# Udemy CaptionCraft

Udemy CaptionCraft é uma extensão para o Google Chrome projetada para aprimorar a experiência de legendas na plataforma Udemy. Ela permite que os usuários personalizem a aparência das legendas e as traduzam para diversos idiomas em tempo real.

## Funcionalidades

- **Tradução de Legendas**: Traduza as legendas dos cursos da Udemy para vários idiomas, incluindo Português, Inglês, Espanhol, Francês, e mais.
- **Personalização de Estilo**:
  - **Tamanho da Fonte**: Ajuste o tamanho da fonte das legendas para melhor legibilidade.
  - **Cor da Fonte**: Escolha a cor de sua preferência para o texto da legenda.
  - **Transparência do Fundo**: Controle a opacidade do fundo da legenda para maior contraste ou discrição.
  - **Alinhamento do Texto**: Defina o alinhamento do texto da legenda (esquerda, centro, direita).
  - **Posição Vertical**: Ajuste a posição vertical da legenda na tela para otimizar a visualização do vídeo.
- **Interface Amigável**: Um popup simples e intuitivo permite configurar todas as opções rapidamente.
- **Aplicação Automática**: As configurações são salvas e aplicadas automaticamente.

## Como Usar

1.  **Instalação**:
    - Clone ou baixe este repositório.
    - Abra o Google Chrome, vá para `chrome://extensions/`.
    - Ative o "Modo do desenvolvedor" no canto superior direito.
    - Clique em "Carregar sem compactação" e selecione a pasta do projeto.
2.  **Uso**:
    - Navegue até uma página de curso ou aula na Udemy que contenha legendas.
    - Clique no ícone da extensão Udemy CaptionCraft ao lado da barra de endereços do Chrome.
    - Ajuste as configurações de tradução e estilo conforme desejado no popup.
    - As alterações serão refletidas nas legendas da Udemy em tempo real.

## Arquivos do Projeto

- `manifest.json`: Define as configurações base da extensão, permissões e scripts.
- `popup.html`: Estrutura HTML da interface do usuário (popup).
- `popup.js`: Lógica JavaScript para o popup, gerenciamento de configurações do usuário e comunicação com o script de conteúdo.
- `content.js`: Script injetado nas páginas da Udemy para manipular as legendas, aplicar estilos e realizar traduções.
- `images/`: Contém os ícones da extensão.

## To Do (Próximas Funcionalidades e Melhorias)

- **Ajustes de Estilo para Modo Tela Cheia**: Investigar e implementar uma melhor adaptação/posicionamento das legendas personalizadas quando o vídeo da Udemy estiver em modo tela cheia. Atualmente, a posição vertical pode precisar de ajustes manuais adicionais ou pode não se comportar como esperado em todas as resoluções de tela cheia.
- **Perfis de Configuração**: Permitir que os usuários salvem e carreguem diferentes perfis de configurações.
- **Mais Opções de Fonte**: Adicionar a possibilidade de escolher diferentes famílias de fontes.
- **Suporte a Outras Plataformas**: Explorar a possibilidade de estender a funcionalidade para outras plataformas de e-learning.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

---

_Este README foi gerado com base nos arquivos e funcionalidades da extensão Udemy CaptionCraft._
