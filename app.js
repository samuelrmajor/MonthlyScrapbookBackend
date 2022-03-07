const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')


const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

  //Use CORS
app.use(cors())

//Not sure what does / if is needed
// app.use(express.static('build'))

app.use(express.json())

//Not in project yet/ needs to be in a module
// app.use(middleware.requestLogger)

//Needs to be a module
// app.use('/api/notes', notesRouter)
app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})




//Not in index yet/ needs to be in a module
// app.use(middleware.requestLogger)
// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

module.exports = app