import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import ReactDOM from 'react-dom/client'
import App from './App'

const apolloClient = new ApolloClient({
	uri: 'http://localhost:4000',
	cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById('root')).render(
	<ApolloProvider client={apolloClient}>
		<App />
	</ApolloProvider>
)
