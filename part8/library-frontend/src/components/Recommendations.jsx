import { useQuery } from '@apollo/client'
import { ME, ALL_BOOKS } from '../queries'

const Recommendations = () => {
	const { data: meData, loading: meLoading } = useQuery(ME)
	const favoriteGenre = meData?.me?.favoriteGenre

	const { data: booksData, loading: booksLoading } = useQuery(ALL_BOOKS, {
		// Only run the books query once we know the user's favorite genre.
		variables: { genre: favoriteGenre },
		skip: !favoriteGenre,
	})

	if (meLoading || booksLoading) return <div>loading...</div>

	return (
		<div>
			<h2>recommendations</h2>
			<p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{booksData?.allBooks.map(book => (
						<tr key={book.id}>
							<td>{book.title}</td>
							<td>{book.author.name}</td>
							<td>{book.published}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default Recommendations
