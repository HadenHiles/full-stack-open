import { useEffect, useState } from 'react'
import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Link,
	List,
	ListItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import axios from 'axios'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
	const userCreatedThisBlog = user?.username === blog.user?.username
	const [comments, setComments] = useState([])
	const [newComment, setNewComment] = useState('')

	useEffect(() => {
		axios.get(`/api/blogs/${blog.id}/comments`).then(res => setComments(res.data))
	}, [blog.id])

	const handleAddComment = async (event) => {
		event.preventDefault()
		const { data: updatedComments } = await axios.post(
			`/api/blogs/${blog.id}/comments`,
			{ comment: newComment }
		)
		setComments(updatedComments)
		setNewComment('')
	}

	return (
		<Card className="blog-details" sx={{ maxWidth: 680, mt: 3 }}>
			<CardContent>
				<Stack spacing={2}>
					<Typography component="h2" variant="h4">
						{blog.title}
					</Typography>
					<Link href={blog.url} target="_blank" rel="noreferrer">
						{blog.url}
					</Link>
					<Typography color="text.secondary">
						added by {blog.user?.name}
					</Typography>
					<Typography>{blog.likes} likes</Typography>
				</Stack>
			</CardContent>
			{user && (
				<CardActions>
					<Button variant="contained" onClick={handleLike}>
						like
					</Button>
					{userCreatedThisBlog && (
						<Button color="error" onClick={handleRemove}>
							remove
						</Button>
					)}
				</CardActions>
			)}
			<CardContent>
				<Typography variant="h6">comments</Typography>
				<Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, mb: 1 }}>
					<TextField
						size="small"
						value={newComment}
						onChange={e => setNewComment(e.target.value)}
						placeholder="add a comment"
					/>
					<Button type="submit" variant="outlined" size="small">add</Button>
				</Box>
				<List dense>
					{comments.map((comment, index) => (
						// Comments are anonymous strings; index is safe as key since the list only grows.
						<ListItem key={index}>{comment}</ListItem>
					))}
				</List>
			</CardContent>
		</Card>
	)
}

export default Blog
