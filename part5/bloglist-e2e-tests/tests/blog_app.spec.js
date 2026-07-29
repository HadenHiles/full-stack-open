const { test, expect } = require('@playwright/test')

const logInThroughForm = async (
	page,
	username = 'tester',
	password = 'secret'
) => {
	await page.getByRole('link', { name: 'login' }).click()
	await page.getByLabel('username').fill(username)
	await page.getByLabel('password').fill(password)
	await page.getByRole('button', { name: 'login' }).click()
}

const createBlogThroughForm = async (page, title = 'End-to-end testing') => {
	await page.getByRole('link', { name: 'create new' }).click()
	await page.getByLabel('title').fill(title)
	await page.getByLabel('author').fill('Test User')
	await page.getByLabel('url').fill('https://example.com/e2e')
	await page.getByRole('button', { name: 'create' }).click()
}

test.describe('Blog app', () => {
	test.beforeEach(async ({ page, request }) => {
		// Every test gets a predictable database and the same basic account.
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

	test('login succeeds with correct credentials', async ({ page }) => {
		await logInThroughForm(page)
		await expect(page.getByText('Test User logged in')).toBeVisible()
		await expect(page).toHaveURL('/')
	})

	test('login fails with incorrect credentials', async ({ page }) => {
		await logInThroughForm(page, 'tester', 'wrong')
		await expect(page.locator('.error')).toContainText(
			'wrong username or password'
		)
		await expect(page.getByText('Test User logged in')).not.toBeVisible()
	})

	test.describe('when logged in', () => {
		test.beforeEach(async ({ page }) => {
			await logInThroughForm(page)
		})

		test('a blog can be created', async ({ page }) => {
			await createBlogThroughForm(page)
			await expect(
				page.getByRole('link', { name: 'End-to-end testing' })
			).toBeVisible()
		})

		test('a blog can be liked', async ({ page }) => {
			await createBlogThroughForm(page, 'A likeable blog')
			await page.getByRole('link', { name: 'A likeable blog' }).click()
			await page.getByRole('button', { name: 'like' }).click()
			await expect(page.getByText('1 likes')).toBeVisible()
		})

		test('the creator can delete a blog', async ({ page }) => {
			await createBlogThroughForm(page, 'Disposable blog')
			await page.getByRole('link', { name: 'Disposable blog' }).click()
			page.on('dialog', (dialog) => dialog.accept())
			await page.getByRole('button', { name: 'remove' }).click()

			await expect(page).toHaveURL('/')
			await expect(
				page.getByRole('link', { name: 'Disposable blog' })
			).not.toBeVisible()
		})
	})
})
