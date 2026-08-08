import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import ReactDOM from 'react-dom/client'
import App from './App'

const httpLink = createHttpLink({ uri: 'http://localhost:4000' })

// Attach the stored JWT to every request so mutations work when logged in.
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('library-user-token')
	return {
		headers: { ...headers, authorization: token ? `bearer ${token}` : '' },
	}
})

// Use WebSocket transport for subscriptions, HTTP for queries and mutations.
const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000' }))

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query)
		return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
	},
	wsLink,
	authLink.concat(httpLink)
)

const apolloClient = new ApolloClient({
	link: splitLink,
	cache: new InMemoryCache({
		typePolicies: {
			Query: {
				fields: {
					// Treat each genre value as a separate cache entry so switching
					// genres fetches from cache without a network round-trip.
					allBooks: {
						keyArgs: ['genre'],
					},
				},
			},
		},
	}),
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={apolloClient}>
		<App />
	</ApolloProvider>
)
