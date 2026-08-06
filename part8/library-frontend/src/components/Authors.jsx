import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = () => {
	const { loading, data } = useQuery(ALL_AUTHORS)
	const [selectedName, setSelectedName] = useState('')
	const [bornYear, setBornYear] = useState('')

	const [editAuthor] = useMutation(EDIT_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	})

	if (loading) return <div>loading...</div>

	const handleBirthYearSubmit = (event) => {
		event.preventDefault()
		editAuthor({ variables: { name: selectedName, setBornTo: Number(bornYear) } })
		setBornYear('')
	}

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{data.allAuthors.map(author => (
						<tr key={author.id}>
							<td>{author.name}</td>
							<td>{author.born}</td>
							<td>{author.bookCount}</td>
						</tr>
					))}
				</tbody>
			</table>
			<h3>Set birthyear</h3>
			<form onSubmit={handleBirthYearSubmit}>
				<div>
					name
					<input value={selectedName} onChange={(e) => setSelectedName(e.target.value)} />
				</div>
				<div>
					born
					<input type="number" value={bornYear} onChange={(e) => setBornYear(e.target.value)} />
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	)
}

export default Authors
