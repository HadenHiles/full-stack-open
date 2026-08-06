// Run with: node db.js to seed the initial dataset into MongoDB.
import mongoose from 'mongoose'
import 'dotenv/config'
import Author from './models/author.js'
import Book from './models/book.js'

await mongoose.connect(process.env.MONGODB_URI)

await Author.deleteMany({})
await Book.deleteMany({})

const authors = await Author.insertMany([
	{ name: 'Robert Martin', born: 1952 },
	{ name: 'Martin Fowler', born: 1963 },
	{ name: 'Fyodor Dostoevsky', born: 1821 },
	{ name: 'Joshua Kerievsky' },
	{ name: 'Sandi Metz' },
])

const byName = (name) => authors.find(a => a.name === name)._id

await Book.insertMany([
	{ title: 'Clean Code', published: 2008, author: byName('Robert Martin'), genres: ['refactoring'] },
	{ title: 'Agile software development', published: 2002, author: byName('Robert Martin'), genres: ['agile', 'patterns', 'design'] },
	{ title: 'Refactoring, edition 2', published: 2018, author: byName('Martin Fowler'), genres: ['refactoring'] },
	{ title: 'Refactoring to patterns', published: 2008, author: byName('Joshua Kerievsky'), genres: ['refactoring', 'patterns'] },
	{ title: 'Practical Object-Oriented Design', published: 2012, author: byName('Sandi Metz'), genres: ['refactoring', 'design'] },
	{ title: 'Crime and punishment', published: 1866, author: byName('Fyodor Dostoevsky'), genres: ['classic', 'crime'] },
	{ title: 'Demons', published: 1872, author: byName('Fyodor Dostoevsky'), genres: ['classic', 'revolution'] },
])

console.log('Database seeded successfully')
await mongoose.disconnect()
