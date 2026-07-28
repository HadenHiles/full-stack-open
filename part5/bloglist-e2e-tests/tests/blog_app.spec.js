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

    test('the creator can delete a blog', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Disposable blog')
      await page.getByLabel('author').fill('Test User')
      await page.getByLabel('url').fill('https://example.com/delete')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText(/Disposable blog Test User/)).not.toBeVisible()
    })

    test('only the creator sees the remove button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByLabel('title').fill('Someone else’s blog')
      await page.getByLabel('author').fill('Test User')
      await page.getByLabel('url').fill('https://example.com/owned')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3001/api/users', {
        data: { name: 'Other User', username: 'other', password: 'secret' },
      })
      await page.getByLabel('username').fill('other')
      await page.getByLabel('password').fill('secret')
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered with the most liked first', async ({ page, request }) => {
      const loginResponse = await request.post('http://localhost:3001/api/login', {
        data: { username: 'tester', password: 'secret' },
      })
      const { token } = await loginResponse.json()
      const headers = { Authorization: `Bearer ${token}` }
      const entries = [
        { title: 'Few likes', author: 'One', url: 'https://example.com/1', likes: 1 },
        { title: 'Most likes', author: 'Two', url: 'https://example.com/2', likes: 12 },
        { title: 'Some likes', author: 'Three', url: 'https://example.com/3', likes: 5 },
      ]
      for (const data of entries) {
        await request.post('http://localhost:3001/api/blogs', { data, headers })
      }
      await page.reload()

      const blogs = page.locator('.blog-summary')
      await expect(blogs.nth(0)).toContainText('Most likes')
      await expect(blogs.nth(1)).toContainText('Some likes')
      await expect(blogs.nth(2)).toContainText('Few likes')
    })
  })
})
