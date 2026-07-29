const Blog = ({ blog, user, handleLike, handleRemove }) => {
	const userCreatedThisBlog = user?.username === blog.user?.username

	return (
		<div className="blog-details">
			<h2>{blog.title}</h2>
			<div>
				<a href={blog.url}>{blog.url}</a>
			</div>
			<div>
				{blog.likes} likes{' '}
				{user && <button onClick={handleLike}>like</button>}
			</div>
			<div>added by {blog.user?.name}</div>
			{userCreatedThisBlog && (
				<button onClick={handleRemove}>remove</button>
			)}
		</div>
	)
}

export default Blog
