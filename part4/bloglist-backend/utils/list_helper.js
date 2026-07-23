const dummy = (_blogs) => 1

const totalsByAuthor = (blogs, valueForBlog) => {
	return blogs.reduce((totals, blog) => {
		totals[blog.author] = (totals[blog.author] || 0) + valueForBlog(blog)
		return totals
	}, {})
}

const totalLikes = blogs => {
	return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = blogs => {
	return blogs.reduce((currentFavorite, blog) => {
		// Starting with null also keeps the empty-list case simple.
		if (!currentFavorite || blog.likes > currentFavorite.likes) {
			return blog
		}

		return currentFavorite
	}, null)
}

const mostBlogs = blogs => {
	// Count first, then pick the winner. Easier to debug than one large reduce.
	const blogCounts = totalsByAuthor(blogs, () => 1)

	return Object.entries(blogCounts).reduce((topAuthor, [author, blogCount]) => {
		if (!topAuthor || blogCount > topAuthor.blogs) {
			return { author, blogs: blogCount }
		}

		return topAuthor
	}, null)
}

const mostLikes = blogs => {
	const likeCounts = totalsByAuthor(blogs, blog => blog.likes)

	return Object.entries(likeCounts).reduce((topAuthor, [author, likes]) => {
		if (!topAuthor || likes > topAuthor.likes) {
			return { author, likes }
		}

		return topAuthor
	}, null)
}

module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
}
