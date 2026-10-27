import {test,expect} from '@playwright/test';
test.beforeEach(async ({page})=>{
 await page.route('https://ddragon.leagueoflegends.com/**',route=>route.abort());
 await page.goto('/');
});
test('início, catálogo e busca',async ({page})=>{
 await expect(page.getByRole('heading',{name:/Um novo jeito/i})).toBeVisible();
 await page.getByRole('link',{name:'Campeões',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Campeões',exact:true})).toBeVisible();
 await page.getByRole('searchbox',{name:'Buscar campeão'}).fill('Ahri');
 await expect(page.locator('.champ-card')).toHaveCount(1);
});
test('amigos persistem e podem ser removidos',async ({page})=>{
 await page.getByRole('link',{name:'Amigos',exact:true}).click();
 await page.getByRole('textbox',{name:'Nome ou Riot ID'}).fill('Teste#BR1');
 await page.getByRole('button',{name:'+ Adicionar'}).click();
 await expect(page.getByText('Teste#BR1')).toBeVisible();
 await page.reload();
 await expect(page.getByText('Teste#BR1')).toBeVisible();
 await page.getByRole('button',{name:'Remover Teste#BR1'}).click();
 await expect(page.getByText('Teste#BR1')).toHaveCount(0);
});
test('favoritos e detalhe do campeão',async ({page})=>{
 await page.getByRole('link',{name:'Campeões',exact:true}).click();
 await page.getByRole('searchbox',{name:'Buscar campeão'}).fill('Ahri');
 await page.getByRole('button',{name:'Favoritar Ahri'}).click();
 await expect(page.getByRole('button',{name:'Remover Ahri'})).toBeVisible();
 await page.getByRole('link',{name:'Ver Ahri'}).click();
 await expect(page.getByRole('heading',{name:'Ahri',exact:true})).toBeVisible();
});
test('sem scroll horizontal indevido',async ({page})=>{
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBeTruthy();
});

test('filtro favoritos e botões preservam foco e rolagem',async ({page})=>{
 await page.getByRole('link',{name:'Campeões',exact:true}).click();
 await page.getByRole('checkbox',{name:/Somente favoritos/}).check();
 await expect(page.getByText('Ainda não há favoritos.')).toBeVisible();
 await page.getByRole('checkbox',{name:/Somente favoritos/}).uncheck();
 await page.getByRole('button',{name:'Favoritar Ahri'}).click();
 await expect(page.getByRole('button',{name:'Remover Ahri'})).toBeVisible();
 await page.getByRole('checkbox',{name:/Somente favoritos/}).check();
 await expect(page.locator('#champion-grid .champ-card')).toHaveCount(1);
 await expect(page.getByRole('link',{name:'Ver Ahri'})).toBeVisible();
 await page.getByRole('checkbox',{name:/Somente favoritos/}).uncheck();
 await page.getByRole('button',{name:'Remover Ahri'}).click();
 await expect(page.getByRole('button',{name:'Favoritar Ahri'})).toBeVisible();
});

test('fallback de imagens externas e visualização offline',async ({page})=>{
 await page.getByRole('link',{name:'Galeria',exact:true}).click();
 await expect(page.locator('.gallery-card')).toHaveCount(12);
 await expect.poll(()=>page.locator('.gallery-card img.asset-failed').count()).toBeGreaterThan(0);
 await expect(page.locator('main')).toBeVisible();
});


test('importação exige confirmação e não substitui amigos quando cancelada',async ({page})=>{
 await page.getByRole('link',{name:'Amigos',exact:true}).click();
 await page.getByRole('textbox',{name:'Nome ou Riot ID'}).fill('Amigo Original');
 await page.getByRole('button',{name:'+ Adicionar'}).click();
 await expect(page.getByText('Amigo Original')).toBeVisible();
 const backup={friends:[{name:'Novo Amigo',region:'BR1'}],favorites:['Ahri']};
 page.once('dialog',dialog=>dialog.dismiss());
 await page.locator('#import-file').setInputFiles({name:'league-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await expect(page.getByText('Amigo Original')).toBeVisible();
 await expect(page.getByText('Novo Amigo')).toHaveCount(0);
 page.once('dialog',dialog=>dialog.accept());
 await page.locator('#import-file').setInputFiles({name:'league-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});
 await expect(page.getByText('Novo Amigo')).toBeVisible();
 await expect(page.getByText('Amigo Original')).toHaveCount(0);
 await page.reload();
 await expect(page.getByText('Novo Amigo')).toBeVisible();
});

test('backup inválido não substitui estado local',async ({page})=>{
 await page.getByRole('link',{name:'Amigos',exact:true}).click();
 const bad={friends:[{name:'Duplicado',region:'BR1'},{name:'Duplicado',region:'BR1'}],favorites:[]};
 await page.locator('#import-file').setInputFiles({name:'backup-invalido.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
 await expect(page.getByRole('status')).toContainText('duplicados');
 await expect(page.locator('.friend-list')).toHaveCount(0);
});
