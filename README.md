# League Friends 2.0 — Social Hub

Modernização do projeto histórico Projeto_Final_DevFrontEnd_FranciscoHelio, agora como aplicação **100% estática** no GitHub Pages, sem PHP obrigatório, banco de dados ou chave Riot no navegador.

## Funcionalidades concluídas nesta branch
- Catálogo Data Dragon pt_BR com versão dinâmica, fallback de reserva e imagens de campeões.
- Busca, filtros por classe, detalhes e favoritos persistidos por navegador.
- Lista de amigos local, migração de dados antigos, importar/exportar JSON e remoção segura.
- Galeria de campeões, páginas sociais e contatos pelo GitHub.
- Responsividade, navegação semântica, foco visível, reduced motion.
- Testes unitários, Playwright em desktop e mobile, workflow de CI e GitHub Pages.

## Desenvolvimento local

    npm install
    npm run dev
    npm run check
    npx playwright install chromium
    npm run test:e2e

## Compatibilidade com GitHub Pages

O repositório também funciona diretamente em **Deploy from a branch → main / (root)**, sem build:
`index.html` referencia `src/style.css` como stylesheet e `src/main.js` como módulo,
e `data/demo.js` é um módulo JavaScript válido. Isso evita os erros de MIME
`text/css` ou `application/json` ao abrir no Pages sem Vite.

A CI testa a raiz com um servidor estático simples (sem Vite), **além** de rodar
`npm run build`. Assim, as duas formas de publicação são verificadas.

## Deploy
Configurar **Settings > Pages > Source: GitHub Actions**. Após merge da branch na main, o workflow publica o site em:

https://helioconde.github.io/Projeto_Final_DevFrontEnd_FranciscoHelio/

O Vite utiliza base path /Projeto_Final_DevFrontEnd_FranciscoHelio/ no build.

## Segurança e limites
- GitHub Pages não executa PHP. Os arquivos legados permanecem no repositório como referência, mas não são importados pelo build.
- Consultas de ranking e partidas **reais** exigem um intermediário seguro. Não confundir as partidas fictícias com resultados ao vivo.
- Dados públicos de campeões são consultados no Data Dragon. Se offline, um catálogo de reserva permite navegar.
- Amigos e favoritos são locais ao navegador. Sem conta e sem sincronização automática.
- Revogar qualquer chave Riot historicamente publicada. Excluir token da branch **não remove o histórico Git**.
- Independente e não endossado pela Riot Games.

## Organização
- src/main.js — navegação e componentes
- src/storage.js — persistência e migração segura
- src/catalog.js — Data Dragon e fallback
- src/style.css — tokens e layout
- data/demo.json — partidas demonstrativas
- docs/DESIGN_SYSTEM.md — padrões visuais
- tests — testes automatizados

Criado por [Hélio Conde](https://github.com/HelioConde).
