/**
 * Extrai imports estáticos sem confundir palavras de UI ("Importar JSON")
 * com a sintaxe JavaScript. Import dinâmico import() não faz parte do fluxo.
 */
export function extractStaticImports(code) {
  if (typeof code !== 'string') return [];
  const pattern = /^[ \t]*import[ \t]+(?:[^;\r\n'"]*?[ \t]+from[ \t]+)?['"]([^'"\r\n]+)['"]/gm;
  return Array.from(code.matchAll(pattern), match => match[1]);
}
