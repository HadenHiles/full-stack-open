const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
	const testBlogs = []

	const dummyResult = listHelper.dummy(testBlogs)

	assert.strictEqual(dummyResult, 1)
})

describe('total likes', () => {
	test('of an empty list is zero', () => {
		assert.strictEqual(listHelper.totalLikes([]), 0)
	})

	test('of one blog equals the likes of that blog', () => {
		const testBlogs = [{ title: 'Go To Statement Considered Harmful', likes: 5 }]

		assert.strictEqual(listHelper.totalLikes(testBlogs), 5)
	})

	test('of many blogs is calculated correctly', () => {
		const testBlogs = [
			{ title: 'Clean Code', likes: 10 },
			{ title: 'Refactoring', likes: 7 },
			{ title: 'Working Effectively with Legacy Code', likes: 3 },
		]

		assert.strictEqual(listHelper.totalLikes(testBlogs), 20)
	})
})

describe('favorite blog', () => {
	test('is the blog with the most likes', () => {
		const testBlogs = [
			{ title: 'Clean Code', author: 'Robert C. Martin', likes: 10 },
			{ title: 'Refactoring', author: 'Martin Fowler', likes: 12 },
			{ title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', likes: 3 },
		]

		assert.deepStrictEqual(listHelper.favoriteBlog(testBlogs), testBlogs[1])
	})
})

describe('most blogs', () => {
	test('identifies the author with the most blogs', () => {
		const testBlogs = [
			{ title: 'Clean Code', author: 'Robert C. Martin', likes: 10 },
			{ title: 'Clean Architecture', author: 'Robert C. Martin', likes: 8 },
			{ title: 'The Clean Coder', author: 'Robert C. Martin', likes: 6 },
			{ title: 'Refactoring', author: 'Martin Fowler', likes: 12 },
			{ title: 'Domain-Driven Design', author: 'Eric Evans', likes: 9 },
		]

		assert.deepStrictEqual(listHelper.mostBlogs(testBlogs), {
			author: 'Robert C. Martin',
			blogs: 3,
		})
	})
})

describe('most likes', () => {
	test('identifies the author whose blogs have the most likes', () => {
		const testBlogs = [
			{ title: 'Clean Code', author: 'Robert C. Martin', likes: 10 },
			{ title: 'Clean Architecture', author: 'Robert C. Martin', likes: 8 },
			{ title: 'Refactoring', author: 'Martin Fowler', likes: 24 },
			{ title: 'Patterns of Enterprise Application Architecture', author: 'Martin Fowler', likes: 11 },
			{ title: 'Domain-Driven Design', author: 'Eric Evans', likes: 9 },
		]

		assert.deepStrictEqual(listHelper.mostLikes(testBlogs), {
			author: 'Martin Fowler',
			likes: 35,
		})
	})
})
