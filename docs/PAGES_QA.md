# Auditoria pós-publicação do GitHub Pages

O build e o Playwright local podem estar aprovados enquanto a URL pública serve
arquivos diferentes, por exemplo código-fonte Vite que produz uma tela branca.
O workflow Pages executa agora um smoke HTTP pós-deploy.

Valida:
- Resposta HTTP 200 e MIME HTML na página inicial.
- JavaScript servido como JavaScript, incluindo imports transitivos.
- CSS servido como CSS por meio da folha de estilos.
- Dados de demonstração como módulo JavaScript na configuração de branch estática.
- Oito tentativas para lidar com propagação e cache.

Execução manual:

    node scripts/verify-pages.mjs https://helioconde.github.io/Projeto_Final_DevFrontEnd_FranciscoHelio/

Este teste usa HTTP; não substitui as 30 capturas Playwright. As duas verificações
complementares protegem contra falhas diferentes: JS/layout e hospedagem real.
