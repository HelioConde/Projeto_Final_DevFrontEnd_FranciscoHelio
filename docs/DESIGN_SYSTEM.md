# League Friends — Design System 2.0

## Direção
Fantasia editorial moderna inspirada em Runeterra, sem reproduzir o cliente oficial Riot.
Hierarquia: hero compacto, navegação clara, seções com uma ação principal, cards com informação concisa.

## Tokens
| Token | Valor | Uso |
| --- | --- | --- |
| --bg | #090f1c | Fundo |
| --surface | #142438 | Painéis |
| --text | #e9eef5 | Principal |
| --muted | #a8b9c9 | Secundário |
| --gold | #e1b76b | Destaques |
| --cyan | #61dedb | Foco e estados |
| --border | #31465d | Contornos |
| --radius | 12px | Cards |

Fonte de títulos Manrope; corpo DM Sans, com fallbacks do sistema. Container 1200px.
Espaçamento em múltiplos de 4; breakpoints principais 760px e 480px.

## Padrões de acessibilidade
Link para pular conteúdo, nav semântica, labels, foco visível, botões de favoritos com aria-pressed,
feedback com aria-live, contraste de texto, reduced motion e estados vazios reais.
Tamanhos de alvo preferencialmente 44px ou mais. Sem rolagem horizontal não intencional.

## Image to Code
As referências foram transformadas em hero com arte oficial, cards de campeões,
galeria, lista de partidas, painéis sociais e ícones com botões acessíveis.
Validar os resultados visualmente com as screenshots do Playwright.

## Segurança e dados
Sem chave privada Riot, sem PHP obrigatório, sem banco de dados.
Dados de partidas explicitamente fictícios; campeões públicos por Data Dragon, com fallback.

## Atualizações de UX
- Favoritos: filtro dedicado e contador persistido; feedback acessível sem redesenho integral dos cards.
- Avisos: desaparecem após alguns segundos e usam aria-live polite.
- Resiliência de mídia: hero, galeria e detalhes recebem fundo local quando o CDN falha.
- Atualizações assíncronas de catálogo não devem limpar formulários de amigos em uso.
- O workflow também verifica a versão pública após o deploy, para identificar incompatibilidades MIME ou publicação desatualizada.

## Importação de dados locais (27/10/2026)
- Backup JSON é validado por esquema, nomes, região, unicidade e limites de 100 amigos/200 favoritos antes de alterar estado.
- Substituir os dados exige uma confirmação explícita; cancelar mantém os dados anteriores.
- O seletor de arquivo é limpo após importação ou erro, permitindo reimportar o mesmo arquivo.
- Playwright cobre importação, cancelamento, persistência e arquivos duplicados, tanto no Vite quanto em cenário estático quando aplicável.
