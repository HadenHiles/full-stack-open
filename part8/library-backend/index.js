import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import 'dotenv/config'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'

mongoose.connect(process.env.MONGODB_URI).then(() => {
	console.log('connected to MongoDB')
}).catch(err => {
	console.error('error connecting to MongoDB:', err.message)
})

const typeDefs = `
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
	Query: {
		bookCount: () => Book.countDocuments(),
		authorCount: () => Author.countDocuments(),

		allBooks: async (_root, { author, genre }) => {
			const filter = {}
			// genres is an array field; $in checks if genre appears in the array.
			if (genre) filter.genres = { $in: [genre] }

			if (author) {
				const matchedAuthor = await Author.findOne({ name: author })
				if (!matchedAuthor) return []
				filter.author = matchedAuthor._id
			}

			// Populate so Book.author resolves to a full Author object.
			return Book.find(filter).populate('author')
		},

		allAuthors: () => Author.find({}),
		me: (_root, _args, context) => context.currentUser,
	},

	Author: {
		// Count inline to avoid loading all books into memory for each author.
		bookCount: (root) => Book.countDocuments({ author: root._id }),
	},

	Mutation: {
		addBook: async (_root, args, context) => {
			// Only authenticated users can add books.
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
			}
			let authorDoc = await Author.findOne({ name: args.author })

			// Create the author record if we have not seen them before.
			if (!authorDoc) {
				authorDoc = new Author({ name: args.author })
				await authorDoc.save()
			}

			const newBook = new Book({ ...args, author: authorDoc._id })
			await newBook.save()
			return newBook.populate('author')
		},

		editAuthor: async (_root, { name, setBornTo }, context) => {
			// Only authenticated users can edit author details.
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
			}
			const matchedAuthor = await Author.findOne({ name })
			if (!matchedAuthor) return null
			matchedAuthor.born = setBornTo
			return matchedAuthor.save()
		},

		createUser: async (_root, { username, favoriteGenre }) => {
			const newUser = new User({ username, favoriteGenre })
			return newUser.save().catch(err => {
				throw new GraphQLError('Creating user failed', { extensions: { code: 'BAD_USER_INPUT', error: err } })
			})
		},

		login: async (_root, { username, password }) => {
			const user = await User.findOne({ username })
			// All users share a hardcoded password for this exercise; real apps must use bcrypt.
			if (!user || password !== 'secret') {
				throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })
			}
			const tokenPayload = { username: user.username, id: user._id }
			return { value: jwt.sign(tokenPayload, process.env.JWT_SECRET) }
		},
	},
}

const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, {
	listen: { port: process.env.PORT || 4000 },
	context: async ({ req }) => {
		const authHeader = req.headers.authorization
		if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
			const token = authHeader.substring(7)
			try {
				const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
				const currentUser = await User.findById(decodedToken.id)
				return { currentUser }
			} catch {
				// Invalid token; treat as unauthenticated.
			}
		}
		return {}
	},
})
console.log(`Server ready at ${url}`)
