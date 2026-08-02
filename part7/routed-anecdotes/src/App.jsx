import { Routes, Route, useMatch } from 'react-router-dom'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Notification from './components/Notification'
import { useAnecdotes, useNotification } from './hooks'

const AnecdoteDetail = ({ anecdote }) => {
	if (!anecdote) return null
	return (
		<div>
			<h2>{anecdote.content} by {anecdote.author}</h2>
			<p>has {anecdote.votes} votes</p>
			<p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
		</div>
	)
}

const App = () => {
	const { anecdotes, addAnecdote } = useAnecdotes()
	const { message, notify } = useNotification()

	const handleCreate = async (anecdote) => {
		const savedAnecdote = await addAnecdote(anecdote)
		notify(`a new anecdote '${savedAnecdote.content}' created!`)
	}

	const match = useMatch('/anecdotes/:id')
	const selectedAnecdote = match
		? anecdotes.find(a => a.id === Number(match.params.id))
		: null

	return (
		<div>
			<h1>Software anecdotes</h1>
			<Menu />
			<Notification message={message} />
			<Routes>
				<Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
				<Route path="/anecdotes/:id" element={<AnecdoteDetail anecdote={selectedAnecdote} />} />
				<Route path="/create" element={<CreateNew addAnecdote={handleCreate} />} />
				<Route path="/about" element={<About />} />
			</Routes>
			<Footer />
		</div>
	)
}

export default App
