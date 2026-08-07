import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = () => {
	const [selectedGenre, setSelectedGenre] = useState(null)

	// Fetch books matching the selected genre (null returns all books).
	const { loading, data } = useQuery(ALL_BOOKS, {
		variables: { genre: selectedGenre },
	})

	if (loading) return <div>loading...</div>

	// Collect all unique genres from the unfiltered book list for the filter buttons.
	const allGenresQuery = useQuery(ALL_BOOKS)
	const allGenres = allGenresQuery.data
		? [...new Set(allGenresQuery.data.allBooks.flatMap(b => b.genres))]
		: []

	return (
		<div>
			<h2>books</h2>
			{selectedGenre && <p>in genre <strong>{selectedGenre}</strong></p>}
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{data.allBooks.map(book => (
						<tr key={book.id}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
				{allGenres.map(genre => (
					<button key={genre} onClick={() => setSelectedGenre(genre)}>{genre}</button>
				))}
				<button onClick={() => setSelectedGenre(null)}>all genres</button>
			</div>
		</div>
	)
}

export default Books
