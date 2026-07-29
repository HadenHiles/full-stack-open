import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'

const BlogForm = ({ createBlog }) => {
	const [title, setTitle] = useState('')
	const [author, setAuthor] = useState('')
	const [url, setUrl] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()

		createBlog({ title, author, url })

		setTitle('')
		setAuthor('')
		setUrl('')
	}

	return (
		<div>
			<h2>create new</h2>
			<Box
				component="form"
				onSubmit={handleSubmit}
				sx={{ maxWidth: 520 }}
			>
				<TextField
					fullWidth
					name="title"
					label="title"
					value={title}
					onChange={({ target }) => setTitle(target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					name="author"
					label="author"
					value={author}
					onChange={({ target }) => setAuthor(target.value)}
					margin="normal"
				/>
				<TextField
					fullWidth
					name="url"
					label="url"
					value={url}
					onChange={({ target }) => setUrl(target.value)}
					margin="normal"
				/>
				<Button type="submit" variant="contained" sx={{ mt: 1 }}>
					create
				</Button>
			</Box>
		</div>
	)
}

export default BlogForm
