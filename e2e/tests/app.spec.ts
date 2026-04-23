import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('1. app loads and shows dashboard', async ({ page }) => {
  await expect(page.getByText('pennylog')).toBeVisible();
  await expect(page.getByTestId('period-today')).toBeVisible();
  await expect(page.getByTestId('period-week')).toBeVisible();
  await expect(page.getByTestId('period-month')).toBeVisible();
  await expect(page.getByTestId('period-year')).toBeVisible();
  await expect(page.getByText('Total Income')).toBeVisible();
  await expect(page.getByText('Total Expenses')).toBeVisible();
  await expect(page.getByText('Net Cash Flow')).toBeVisible();
  await expect(page.getByTestId('add-transaction-btn')).toBeVisible();
});

test('2. create expense transaction', async ({ page }) => {
  await page.getByTestId('add-transaction-btn').click();
  await expect(page.getByRole('heading', { name: 'Add Transaction' })).toBeVisible();

  // Select expense type (already default)
  await page.getByTestId('amount-input').fill('42.50');

  // Select category — wait for options to load
  await page.waitForSelector('[data-testid="category-select"] option:not([disabled])', { state: 'attached' });
  await page.selectOption('[data-testid="category-select"]', { index: 1 });

  await page.getByTestId('date-input').fill(new Date().toISOString().split('T')[0]);
  await page.getByTestId('description-input').fill('Test grocery run');

  await page.getByTestId('submit-transaction-btn').click();

  // Modal should close and transaction should appear
  await expect(page.getByRole('heading', { name: 'Add Transaction' })).not.toBeVisible();
  await expect(page.getByText('Test grocery run')).toBeVisible();
});

test('3. edit transaction', async ({ page }) => {
  // First create one
  await page.getByTestId('add-transaction-btn').click();
  await page.getByTestId('amount-input').fill('100');
  await page.waitForSelector('[data-testid="category-select"] option:not([disabled])', { state: 'attached' });
  await page.selectOption('[data-testid="category-select"]', { index: 1 });
  await page.getByTestId('date-input').fill(new Date().toISOString().split('T')[0]);
  await page.getByTestId('submit-transaction-btn').click();
  await expect(page.getByRole('heading', { name: 'Add Transaction' })).not.toBeVisible();

  // Edit it
  const editBtn = page.getByTestId('edit-transaction-btn').first();
  await editBtn.click();

  await expect(page.getByText('Edit Transaction')).toBeVisible();

  await page.getByTestId('amount-input').clear();
  await page.getByTestId('amount-input').fill('150');
  await page.getByTestId('submit-transaction-btn').click();

  await expect(page.getByText('Edit Transaction')).not.toBeVisible();
  await expect(page.getByText('$150.00')).toBeVisible();
});

test('4. delete transaction', async ({ page }) => {
  // Create a transaction
  await page.getByTestId('add-transaction-btn').click();
  await page.getByTestId('amount-input').fill('25');
  await page.waitForSelector('[data-testid="category-select"] option:not([disabled])', { state: 'attached' });
  await page.selectOption('[data-testid="category-select"]', { index: 1 });
  await page.getByTestId('date-input').fill(new Date().toISOString().split('T')[0]);
  await page.getByTestId('description-input').fill('to-be-deleted');
  await page.getByTestId('submit-transaction-btn').click();
  await expect(page.getByText('to-be-deleted').first()).toBeVisible();

  const countBefore = await page.getByTestId('transaction-item').count();

  // Delete it (accept the confirm dialog)
  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('delete-transaction-btn').first().click();

  await expect(page.getByTestId('transaction-item')).toHaveCount(countBefore - 1);
});

test('5. period filter updates dashboard data', async ({ page }) => {
  // Switch to "Today"
  await page.getByTestId('period-today').click();
  await expect(page.getByTestId('period-today')).toHaveClass(/active/);

  // Switch to "This Year"
  await page.getByTestId('period-year').click();
  await expect(page.getByTestId('period-year')).toHaveClass(/active/);

  // KPI cards should still be visible after period change
  await expect(page.getByText('Total Income')).toBeVisible();
  await expect(page.getByText('Total Expenses')).toBeVisible();
});
