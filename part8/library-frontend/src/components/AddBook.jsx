import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'

const AddBook = () => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [published, setPublished] = useState('')
	const [genre, setGenre] = useState('')
	const [genres, setGenres] = useState([])

	const [addBook] = useMutation(ADD_BOOK, {
		// Keep the authors list fresh when a new author is added via the book form.
		refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
	})

	const handleAddGenre = () => {
		if (!genre) return
		setGenres(genres.concat(genre))
		setGenre('')
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		await addBook({
			variables: { title, author, published: Number(published), genres },
		})
		setTitle('')
		setAuthor('')
		setPublished('')
		setGenres([])
	}

	return (
		<div>
			<h2>add book</h2>
			<form onSubmit={handleSubmit}>
				<div>
					title
					<input value={title} onChange={(e) => setTitle(e.target.value)} />
				</div>
				<div>
					author
					<input value={author} onChange={(e) => setAuthor(e.target.value)} />
				</div>
				<div>
					published
					<input type="number" value={published} onChange={(e) => setPublished(e.target.value)} />
				</div>
				<div>
					<input value={genre} onChange={(e) => setGenre(e.target.value)} />
					<button type="button" onClick={handleAddGenre}>add genre</button>
				</div>
				<div>genres: {genres.join(', ')}</div>
				<button type="submit">create book</button>
			</form>
		</div>
	)
}

export default AddBook
