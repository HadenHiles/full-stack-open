import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'
import Author from './models/author.js'
import Book from './models/book.js'

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

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
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
	},

	Author: {
		// Count inline to avoid loading all books into memory for each author.
		bookCount: (root) => Book.countDocuments({ author: root._id }),
	},

	Mutation: {
		addBook: async (_root, args) => {
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

		editAuthor: async (_root, { name, setBornTo }) => {
			const matchedAuthor = await Author.findOne({ name })
			if (!matchedAuthor) return null
			matchedAuthor.born = setBornTo
			return matchedAuthor.save()
		},
	},
}

const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, { listen: { port: process.env.PORT || 4000 } })
console.log(`Server ready at ${url}`)
