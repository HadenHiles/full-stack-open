import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { makeExecutableSchema } from '@graphql-tools/schema'
import express from 'express'
import http from 'http'
import cors from 'cors'
import { WebSocketServer } from 'ws'
import { useServer } from 'graphql-ws/lib/use/ws'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import DataLoader from 'dataloader'
import { GraphQLError, PubSub } from 'graphql'
import 'dotenv/config'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'

mongoose.connect(process.env.MONGODB_URI).then(() => {
	console.log('connected to MongoDB')
}).catch(err => {
	console.error('error connecting to MongoDB:', err.message)
})

const pubsub = new PubSub()
const BOOK_ADDED = 'BOOK_ADDED'

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

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
	Query: {
		bookCount: () => Book.countDocuments(),
		authorCount: () => Author.countDocuments(),

		allBooks: async (_root, { author, genre }) => {
			const filter = {}
			if (genre) filter.genres = { $in: [genre] }

			if (author) {
				const authorDoc = await Author.findOne({ name: author })
				if (!authorDoc) return []
				filter.author = authorDoc._id
			}

			return Book.find(filter).populate('author')
		},

		allAuthors: () => Author.find({}),
		me: (_root, _args, context) => context.currentUser,
	},

	Author: {
		// batch to avoid N+1 on bookCount
		bookCount: (root, _args, context) =>
			context.loaders.bookCount.load(root._id.toString()),
	},

	Mutation: {
		addBook: async (_root, args, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
			}
			let author = await Author.findOne({ name: args.author })

			// add author if we haven't seen them before
			if (!author) {
				author = new Author({ name: args.author })
				await author.save()
			}

			const newBook = new Book({ ...args, author: author._id })
			await newBook.save()
			const bookWithAuthor = await newBook.populate('author')

			pubsub.publish(BOOK_ADDED, { bookAdded: bookWithAuthor })
			return bookWithAuthor
		},

		editAuthor: async (_root, { name, setBornTo }, context) => {
			if (!context.currentUser) {
				throw new GraphQLError('not authenticated', { extensions: { code: 'UNAUTHENTICATED' } })
			}
			const author = await Author.findOne({ name })
			if (!author) return null
			author.born = setBornTo
			return author.save()
		},

		createUser: async (_root, { username, favoriteGenre }) => {
			const newUser = new User({ username, favoriteGenre })
			return newUser.save().catch(err => {
				throw new GraphQLError('Creating user failed', { extensions: { code: 'BAD_USER_INPUT', error: err } })
			})
		},

		login: async (_root, { username, password }) => {
			const user = await User.findOne({ username })
			// hardcoded password for this exercise
			if (!user || password !== 'secret') {
				throw new GraphQLError('wrong credentials', { extensions: { code: 'BAD_USER_INPUT' } })
			}
			const payload = { username: user.username, id: user._id }
			return { value: jwt.sign(payload, process.env.JWT_SECRET) }
		},
	},

	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterableIterator(BOOK_ADDED),
		},
	},
}

// fresh loader per request so counts don't carry over between requests
const createBookCountLoader = () =>
	new DataLoader(async (authorIds) => {
		const counts = await Book.aggregate([
			{ $match: { author: { $in: authorIds.map(id => new mongoose.Types.ObjectId(id)) } } },
			{ $group: { _id: '$author', count: { $sum: 1 } } },
		])
		const countByAuthor = Object.fromEntries(counts.map(c => [c._id.toString(), c.count]))
		return authorIds.map(id => countByAuthor[id] ?? 0)
	})

const getUserFromToken = async (req) => {
	const authHeader = req?.headers?.authorization
	if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
		const token = authHeader.substring(7)
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET)
			return User.findById(decoded.id)
		} catch {
			// bad token = not logged in
		}
	}
	return null
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const app = express()
const httpServer = http.createServer(app)

// ws server has to wrap the http server, not app directly
const wsServer = new WebSocketServer({ server: httpServer, path: '/' })
const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
	schema,
	plugins: [
		ApolloServerPluginDrainHttpServer({ httpServer }),
		{
			async serverWillStart() {
				return {
					async drainServer() {
						await serverCleanup.dispose()
					},
				}
			},
		},
	],
})

await server.start()

app.use('/', cors(), express.json(), expressMiddleware(server, {
	context: async ({ req }) => ({
		currentUser: await getUserFromToken(req),
		loaders: { bookCount: createBookCountLoader() },
	}),
}))

const PORT = process.env.PORT || 4000
httpServer.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}`))
