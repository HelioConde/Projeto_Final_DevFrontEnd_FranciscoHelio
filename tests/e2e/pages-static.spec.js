import { test, expect } from '@playwright/test';

// Reproduz o cenário real do GitHub Pages com os arquivos do repositório
// servidos diretamente, sem Vite dev server e sem PHP.
test('GitHub Pages: HTML inicia, CSS e ES modules têm MIME correto', async ({ page }) => {
  const errors = [];
  const localErrors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4173/') && response.status() >= 400) {
      localErrors.push(response.status() + ' ' + response.url());
    }
  });
  await page.route('https://ddragon.leagueoflegends.com/**', route => route.abort());
  const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { name: /Um novo jeito/i })).toBeVisible();
  await expect(page.locator('#app .hero')).toBeVisible();
  expect(errors).toEqual([]);
  expect(localErrors).toEqual([]);
  const assets = [
    ['./src/main.js', /javascript/],
    ['./src/style.css', /css/],
    ['./data/demo.js', /javascript/],
    ['./favicon.svg', /svg/]
  ];
  for (const [path, mime] of assets) {
    const result = await page.request.get(path);
    expect(result.status(), path).toBe(200);
    expect(result.headers()['content-type'], path).toMatch(mime);
  }
  const styles = await page.evaluate(() => ({
    font: getComputedStyle(document.body).fontFamily,
    foreground: getComputedStyle(document.documentElement).color
  }));
  expect(styles.font).not.toBe('');
  expect(styles.foreground).not.toBe('rgb(0, 0, 0)');
});

test('GitHub Pages: favoritos, galeria e hash nav funcionam sem build', async ({ page }) => {
  await page.route('https://ddragon.leagueoflegends.com/**', route => route.abort());
  await page.goto('/');
  await page.getByRole('link', { name: 'Campeões', exact: true }).click();
  await expect(page.locator('#champion-grid .champ-card')).toHaveCount(12);
  await page.getByRole('button', { name: 'Favoritar Ahri' }).click();
  await expect(page.getByRole('button', { name: 'Remover Ahri' })).toBeVisible();
  await page.getByRole('link', { name: 'Galeria', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Arte de Runeterra' })).toBeVisible();
});
