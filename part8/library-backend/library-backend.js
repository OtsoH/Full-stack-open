const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
require('dotenv').config()
const Book = require('./models/book')
const Author =require('./models/author')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to MongoDB')

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    addAuthor(
      name: String!
      born: Int
    ): Author!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {}

      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          filter.author = author._id
        } else {
          return []
        }
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] }
      }

      return Book.find(filter).populate('author')
    },

    allAuthors: async () => {
      const authors = await Author.find({})

      const authorsWithBookCount = await Promise.all(
        authors.map(async (author) => {
          const bookCount = await Book.countDocuments({ author: author._id })
          return {
            name: author.name,
            born: author.born,
            id: author._id.toString(),
            bookCount
          }
        })
      )

      return authorsWithBookCount
    },

    me: async (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      })

      try {
        await user.save()
        return user
      } catch (error) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`User validation failed: ${messages.join(', ')}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }

        if (error.code === 11000) {
          throw new GraphQLError('Username must be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        }

        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message)
            throw new GraphQLError(`Author validation failed: ${messages.join(', ')}`, {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }

          if (error.code === 11000) {
            throw new GraphQLError('Author name must be unique', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.author,
                error
              }
            })
          }

          throw new GraphQLError('Creating author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres
      })

      try {
        await book.save()
        await book.populate('author')
        return book

      } catch (error) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`Book validation failed: ${messages.join(', ')}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }

        if (error.code === 11000) {
          throw new GraphQLError('Book title must be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }

        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
    },

    addAuthor: async (root, args) => {
      const author = new Author({ ...args })

      try {
        await author.save()
      } catch (error) {

        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`Author validation failed: ${messages.join(', ')}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }

        if (error.code === 11000) {
          throw new GraphQLError('Author name must be unique', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        throw new GraphQLError('Creating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      return {
        name: author.name,
        born: author.born,
        id: author._id.toString(),
        bookCount: 0
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new GraphQLError('Author not found', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {

        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors).map(err => err.message)
          throw new GraphQLError(`Author validation failed: ${messages.join(', ')}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            }
          })
        }

        throw new GraphQLError('Editing author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }

      const bookCount = await Book.countDocuments({ author: author._id })
      return {
        name: author.name,
        born: author.born,
        id: author._id.toString(),
        bookCount
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  })

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})