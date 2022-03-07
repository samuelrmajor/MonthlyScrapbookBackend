const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const logger = require('./utils/logger')
const mongoose = require('mongoose')




//connect to mongoDB
logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })



app.use(cors())

//Not sure what does / if is needed
// app.use(express.static('build'))

app.use(express.json())

//Not in project yet/ needs to be in a module
// app.use(middleware.requestLogger)


//First Argument is the path base, second is the controllerRouter Module
app.use('/api/blogs', blogsRouter)






//Not in index yet/ needs to be in a module
// app.use(middleware.requestLogger)
// app.use(middleware.unknownEndpoint)
// app.use(middleware.errorHandler)

module.exports = app