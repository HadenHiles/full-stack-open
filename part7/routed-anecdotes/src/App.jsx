import { Routes, Route, useMatch } from 'react-router-dom'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Notification from './components/Notification'
import { AnecdoteProvider, useAnecdoteContext } from './context/AnecdoteContext'

const AnecdoteDetail = () => {
	// Direct hook usage: no need to thread anecdotes down through App.
	const { anecdotes, removeAnecdote, notify } = useAnecdoteContext()
	const match = useMatch('/anecdotes/:id')
	const selectedAnecdote = match
		? anecdotes.find(a => a.id === Number(match.params.id))
		: null

	if (!selectedAnecdote) return null

	const handleRemove = async () => {
		await removeAnecdote(selectedAnecdote.id)
		notify(`'${selectedAnecdote.content}' removed`)
	}

	return (
		<div>
			<h2>{selectedAnecdote.content} by {selectedAnecdote.author}</h2>
			<p>has {selectedAnecdote.votes} votes</p>
			<p>for more info see <a href={selectedAnecdote.info}>{selectedAnecdote.info}</a></p>
			<button onClick={handleRemove}>remove</button>
		</div>
	)
}

const AppRoutes = () => {
	const { message, addAnecdote, notify } = useAnecdoteContext()

	const handleCreate = async (anecdote) => {
		const savedAnecdote = await addAnecdote(anecdote)
		notify(`a new anecdote '${savedAnecdote.content}' created!`)
	}

	return (
		<div>
			<h1>Software anecdotes</h1>
			<Menu />
			<Notification message={message} />
			<Routes>
				<Route path="/" element={<AnecdoteList />} />
				<Route path="/anecdotes/:id" element={<AnecdoteDetail />} />
				<Route path="/create" element={<CreateNew addAnecdote={handleCreate} />} />
				<Route path="/about" element={<About />} />
			</Routes>
			<Footer />
		</div>
	)
}

const App = () => (
	<AnecdoteProvider>
		<AppRoutes />
	</AnecdoteProvider>
)

export default App
