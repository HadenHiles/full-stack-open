import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

const authors = [
	{ name: 'Robert Martin', born: 1952, id: 'afa51ab0-344d-11e9-a414-719c6709cf3e' },
	{ name: 'Martin Fowler', born: 1963, id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e' },
	{ name: 'Fyodor Dostoevsky', born: 1821, id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e' },
	{ name: 'Joshua Kerievsky', id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e' },
	{ name: 'Sandi Metz', id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e' },
]

const books = [
	{ title: 'Clean Code', published: 2008, author: 'Robert Martin', genres: ['refactoring'], id: 'afa5b6f4' },
	{ title: 'Agile software development', published: 2002, author: 'Robert Martin', genres: ['agile', 'patterns', 'design'], id: 'afa5b6f5' },
	{ title: 'Refactoring, edition 2', published: 2018, author: 'Martin Fowler', genres: ['refactoring'], id: 'afa5de00' },
	{ title: 'Refactoring to patterns', published: 2008, author: 'Joshua Kerievsky', genres: ['refactoring', 'patterns'], id: 'afa5de01' },
	{ title: 'Practical Object-Oriented Design', published: 2012, author: 'Sandi Metz', genres: ['refactoring', 'design'], id: 'afa5de02' },
	{ title: 'Crime and punishment', published: 1866, author: 'Fyodor Dostoevsky', genres: ['classic', 'crime'], id: 'afa5de03' },
	{ title: 'Demons', published: 1872, author: 'Fyodor Dostoevsky', genres: ['classic', 'revolution'], id: 'afa5de04' },
]

const typeDefs = `
  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`

const resolvers = {
	Query: {
		bookCount: () => books.length,
		authorCount: () => authors.length,
	},
}

const server = new ApolloServer({ typeDefs, resolvers })
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } })
console.log(`Server ready at ${url}`)
