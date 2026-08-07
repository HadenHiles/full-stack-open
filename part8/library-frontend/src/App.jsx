import { useState } from 'react'
import { useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'

const VIEWS = { authors: 'authors', books: 'books', add: 'add', recommend: 'recommend' }

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.authors)
	// Token is stored in localStorage; this state just controls UI visibility.
	const [token, setToken] = useState(localStorage.getItem('library-user-token'))
	const apolloClient = useApolloClient()

	const handleLoginSuccess = (newToken) => {
		setToken(newToken)
		setActiveView(VIEWS.authors)
	}

	const handleLogout = () => {
		setToken(null)
		localStorage.removeItem('library-user-token')
		// Reset cache so stale authenticated data is cleared on logout.
		apolloClient.resetStore()
	}

	if (!token) {
		return <LoginForm onLoginSuccess={handleLoginSuccess} />
	}

	return (
		<div>
			<nav>
				<button onClick={() => setActiveView(VIEWS.authors)}>authors</button>
				<button onClick={() => setActiveView(VIEWS.books)}>books</button>
				<button onClick={() => setActiveView(VIEWS.add)}>add book</button>
				<button onClick={() => setActiveView(VIEWS.recommend)}>recommend</button>
				<button onClick={handleLogout}>logout</button>
			</nav>
			{activeView === VIEWS.authors && <Authors />}
			{activeView === VIEWS.books && <Books />}
			{activeView === VIEWS.add && <AddBook />}
			{activeView === VIEWS.recommend && <Recommendations />}
		</div>
	)
}

export default App
