const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  test('of an empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('of one blog equals the likes of that blog', () => {
    const blogs = [{ title: 'Go To Statement Considered Harmful', likes: 5 }]

    assert.strictEqual(listHelper.totalLikes(blogs), 5)
  })

  test('of many blogs is calculated correctly', () => {
    const blogs = [
      { title: 'Clean Code', likes: 10 },
      { title: 'Refactoring', likes: 7 },
      { title: 'Working Effectively with Legacy Code', likes: 3 },
    ]

    assert.strictEqual(listHelper.totalLikes(blogs), 20)
  })
})

describe('favorite blog', () => {
  test('is the blog with the most likes', () => {
    const blogs = [
      { title: 'Clean Code', author: 'Robert C. Martin', likes: 10 },
      { title: 'Refactoring', author: 'Martin Fowler', likes: 12 },
      { title: 'Working Effectively with Legacy Code', author: 'Michael Feathers', likes: 3 },
    ]

    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[1])
  })
})
