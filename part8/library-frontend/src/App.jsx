import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import AddBook from './components/AddBook'

const VIEWS = { authors: 'authors', books: 'books', add: 'add' }

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.authors)

	return (
		<div>
			<nav>
				<button onClick={() => setActiveView(VIEWS.authors)}>authors</button>
				<button onClick={() => setActiveView(VIEWS.books)}>books</button>
				<button onClick={() => setActiveView(VIEWS.add)}>add book</button>
			</nav>
			{activeView === VIEWS.authors && <Authors />}
			{activeView === VIEWS.books && <Books />}
			{activeView === VIEWS.add && <AddBook />}
		</div>
	)
}

export default App
