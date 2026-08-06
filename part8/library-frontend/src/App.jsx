import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'

const VIEWS = { authors: 'authors', books: 'books' }

const App = () => {
	const [activeView, setActiveView] = useState(VIEWS.authors)

	return (
		<div>
			<nav>
				<button onClick={() => setActiveView(VIEWS.authors)}>authors</button>
				<button onClick={() => setActiveView(VIEWS.books)}>books</button>
			</nav>
			{activeView === VIEWS.authors && <Authors />}
			{activeView === VIEWS.books && <Books />}
		</div>
	)
}

export default App
