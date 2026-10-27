import test from 'node:test';
import assert from 'node:assert/strict';
import { extractStaticImports } from '../scripts/module-imports.mjs';

test('localiza imports estáticos entre módulos legítimos',()=>{
  const source = [
    "import {settings} from './settings.js';",
    "import data from '../data/demo.js';",
    "import './style.css';",
    'export const value = 1;'
  ].join('\n');
  assert.deepEqual(extractStaticImports(source),
    ['./settings.js','../data/demo.js','./style.css']);
});
test('não confunde mensagens de interface com imports',()=>{
  const source = [
    "const html = '<button>Importar JSON</button>';",
    "const x = 'import data from nonsense';",
    "// importar json é apenas um comentário",
    "import './catalog.js';"
  ].join('\n');
  assert.deepEqual(extractStaticImports(source),['./catalog.js']);
});
test('não retorna caminhos de importações dinâmicas ou textos diversos',()=>{
  assert.deepEqual(extractStaticImports("const x = import('./route.js');"),[]);
});
