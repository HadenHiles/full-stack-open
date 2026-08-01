import { useState, useEffect } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import AnecdoteList from './components/AnecdoteList'
import CreateNew from './components/CreateNew'
import About from './components/About'
import Menu from './components/Menu'
import Footer from './components/Footer'
import Notification from './components/Notification'
import anecdoteService from './services/anecdotes'

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
	const [anecdotes, setAnecdotes] = useState([])
	const [notification, setNotification] = useState('')

	useEffect(() => {
		anecdoteService.getAll().then(data => setAnecdotes(data))
	}, [])

	const handleCreate = async (anecdote) => {
		const savedAnecdote = await anecdoteService.create(anecdote)
		setAnecdotes(prev => prev.concat(savedAnecdote))
		setNotification(`a new anecdote '${savedAnecdote.content}' created!`)
		// Notifications are useful, but they should not hang around forever.
		setTimeout(() => setNotification(''), 5000)
	}

	const match = useMatch('/anecdotes/:id')
	const selectedAnecdote = match
		? anecdotes.find(a => a.id === Number(match.params.id))
		: null

	return (
		<div>
			<h1>Software anecdotes</h1>
			<Menu />
			<Notification message={notification} />
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
