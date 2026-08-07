import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
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

const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={apolloClient}>
		<App />
	</ApolloProvider>
)
