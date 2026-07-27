const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Test User',
        username: 'tester',
        password: 'secret',
      },
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('tester')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('tester')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      const error = page.locator('.error')
      await expect(error).toContainText('wrong username or password')
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('username').fill('tester')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('End-to-end testing')
      await page.getByLabel('author').fill('Test User')
      await page.getByLabel('url').fill('https://example.com/e2e')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText(/End-to-end testing Test User/)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('A likeable blog')
      await page.getByLabel('author').fill('Test User')
      await page.getByLabel('url').fill('https://example.com/likes')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
