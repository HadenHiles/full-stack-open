import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const VIEWS = { authors: 'authors', books: 'books', add: 'add', recommend: 'recommend' }

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.authors)
	// Token is stored in localStorage; this state just controls UI visibility.
	const [token, setToken] = useState(localStorage.getItem('library-user-token'))
	const apolloClient = useApolloClient()

	// Merge newly published books directly into the unfiltered cache entry
	// so the Books view updates in real-time without a refetch.
	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			const addedBook = data.data?.bookAdded
			if (!addedBook) return
			const cachedData = apolloClient.readQuery({ query: ALL_BOOKS, variables: { genre: null } })
			if (cachedData && !cachedData.allBooks.find(b => b.id === addedBook.id)) {
				apolloClient.writeQuery({
					query: ALL_BOOKS,
					variables: { genre: null },
					data: { allBooks: cachedData.allBooks.concat(addedBook) },
				})
			}
		},
	})

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
