const dummy = (_blogs) => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs => blogs.reduce(
  (favorite, blog) => (!favorite || blog.likes > favorite.likes ? blog : favorite),
  null
)

const mostBlogs = blogs => {
  const blogCounts = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
    return counts
  }, {})

  return Object.entries(blogCounts).reduce(
    (topAuthor, [author, blogs]) => (!topAuthor || blogs > topAuthor.blogs ? { author, blogs } : topAuthor),
    null
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}
