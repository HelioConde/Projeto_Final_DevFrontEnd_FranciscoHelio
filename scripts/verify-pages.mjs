/**
 * Teste HTTP pós-deploy, independente de Vite e navegador.
 * Uso: node scripts/verify-pages.mjs https://usuario.github.io/repo/
 */
import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'https://helioconde.github.io/Projeto_Final_DevFrontEnd_FranciscoHelio/');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const mime = (response, regex, description) => {
  assert.match(response.headers.get('content-type') || '', regex,
    description + ': Content-Type inválido em ' + response.url);
};
async function get(url) {
  const target = new URL(url);
  target.searchParams.set('__verify', String(Date.now()));
  const response = await fetch(target, { redirect:'follow', headers:{ 'Cache-Control':'no-cache' }, signal: AbortSignal.timeout(12000) });
  assert.equal(response.status, 200, 'Resposta inesperada ' + response.status + ' em ' + target.pathname);
  return response;
}
function attribute(tag, name) {
  const re = new RegExp('\\b' + name + '\\s*=\\s*["\\x27]([^"\\x27]+)["\\x27]', 'i');
  return tag.match(re)?.[1] || null;
}
async function verify() {
  const visited = new Set();
  const documentResponse = await get(base);
  mime(documentResponse, /text\/html/i, 'HTML');
  const html = await documentResponse.text();
  assert.match(html, /id=["']app["']/, 'Root do aplicativo ausente');
  const tags = html.match(/<script\b[^>]*>/gi) || [];
  const moduleRefs = tags.filter(t => attribute(t, 'type') === 'module')
    .map(t => attribute(t, 'src')).filter(Boolean);
  assert.ok(moduleRefs.length > 0, 'Nenhum entrypoint JavaScript ES module');
  const styles = (html.match(/<link\b[^>]*>/gi) || [])
    .filter(t => attribute(t, 'rel') === 'stylesheet')
    .map(t => attribute(t, 'href')).filter(Boolean);
  assert.ok(styles.length > 0, 'CSS não carregado por link rel=stylesheet');

  for (const stylesheet of styles) {
    const url = new URL(stylesheet, base);
    assert.equal(url.origin, base.origin, 'CSS aponta para outra origem');
    mime(await get(url), /text\/css/i, 'CSS');
  }

  async function verifyModule(url, depth = 0) {
    assert.ok(depth <= 20, 'Dependências profundas demais');
    assert.equal(url.origin, base.origin, 'Import externo inesperado');
    if (visited.has(url.pathname)) return;
    visited.add(url.pathname);
    const response = await get(url);
    mime(response, /javascript|ecmascript/i, 'Módulo JavaScript');
    const code = await response.text();
    assert.doesNotMatch(code, /import\s*(?:[^'"]*?from\s*)?['"][^'"]+\.(?:css|json)['"]/,
      'CSS ou JSON importado como módulo JavaScript em ' + url.pathname);
    const references = [...code.matchAll(/\bimport\s*(?:[^'"]*?\bfrom\s*)?['"]([^'"]+)['"]/g)]
      .map(match => match[1]);
    for (const reference of references) {
      if (!reference.startsWith('.') && !reference.startsWith('/')) {
        throw Error('Import não resolvido para navegador: ' + reference);
      }
      await verifyModule(new URL(reference, url), depth + 1);
    }
  }
  for (const ref of moduleRefs) await verifyModule(new URL(ref, base));

  // Build Vite agrega dados em assets/. Branch estática serve data/demo.js.
  const isRaw = moduleRefs.some(ref => /(?:^|\/)src\/main\.js(?:\?|$)/.test(ref));
  if (isRaw) {
    const response = await get(new URL('data/demo.js', base));
    mime(response, /javascript|ecmascript/i, 'Dados de demonstração');
    assert.match(await response.text(), /export\s+default/, 'Dados demonstrativos sem export');
  }
  console.log('PAGES VERIFIED:',base.href,'styles:',styles.length,'modules:',visited.size,'raw:',isRaw);
}

let last;
for (let attempt = 1; attempt <= 8; attempt++) {
  try { await verify(); process.exit(0); }
  catch (error) {
    last = error;
    console.error('Tentativa',attempt,'de 8:',error.message);
    if (attempt < 8) await delay(7500);
  }
}
console.error('Publicação não passou no teste HTTP:',last?.message);
process.exit(1);
