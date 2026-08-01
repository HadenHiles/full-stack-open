const AnecdoteForm = ({ onCreate }) => {
	const handleCreate = (event) => {
		event.preventDefault()
		onCreate(event.target.anecdote.value)
		event.target.reset()
	}

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={handleCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	)
}

export default AnecdoteForm
