import {
	Button,
	Card,
	CardActions,
	CardContent,
	Link,
	Stack,
	Typography,
} from '@mui/material'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
	const userCreatedThisBlog = user?.username === blog.user?.username

	return (
		<Card className="blog-details" sx={{ maxWidth: 680, mt: 3 }}>
			<CardContent>
				<Stack spacing={2}>
					<Typography component="h2" variant="h4">
						{blog.title}
					</Typography>
					<Link
						href={blog.url}
						target="_blank"
						rel="noreferrer"
					>
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
		</Card>
	)
}

export default Blog
