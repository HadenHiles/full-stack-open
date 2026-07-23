const dummy = (_blogs) => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs => blogs.reduce(
  (favorite, blog) => (!favorite || blog.likes > favorite.likes ? blog : favorite),
  null
)

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
