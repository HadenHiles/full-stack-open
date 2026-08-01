import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = ({ addAnecdote }) => {
	const content = useField('text')
	const author = useField('text')
	const info = useField('text')
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		await addAnecdote({
			content: content.value,
			author: author.value,
			info: info.value,
			votes: 0,
		})
		navigate('/')
	}

	const handleReset = () => {
		content.reset()
		author.reset()
		info.reset()
	}

	// Destructure reset out so it is not forwarded to the DOM input element.
	const { reset: _resetContent, ...contentProps } = content
	const { reset: _resetAuthor, ...authorProps } = author
	const { reset: _resetInfo, ...infoProps } = info

	return (
		<div>
			<h2>create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					content
					<input {...contentProps} />
				</div>
				<div>
					author
					<input {...authorProps} />
				</div>
				<div>
					url for more info
					<input {...infoProps} />
				</div>
				<button type="submit">create</button>
				<button type="button" onClick={handleReset}>reset</button>
			</form>
		</div>
	)
}

export default CreateNew
