const _ = require('lodash')

const dummy = (blogs) => {
    return 1

}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    return blogs.reduce((highest, current) => {
        return current.likes > highest.likes ? current : highest
        }, blogs[0])
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const blogsByAuthor = _.groupBy(blogs, 'author')

    const authors = _.map(blogsByAuthor, (blogs, author) => {
        return {
            author: author,
            blogs: blogs.length
        }
    })

    return _.maxBy(authors, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const likesByAuthor = _.groupBy(blogs, 'author')

    const authors = _.map(likesByAuthor, (blogs, author) => {
      const totalLikes = _.sumBy(blogs, 'likes')
        return {
          author: author,
          likes: totalLikes
        }
    })
    return _.maxBy(authors, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
