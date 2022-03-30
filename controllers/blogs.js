const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')



//Creates new Blog Object
blogsRouter.post('/', async (request, response) => {
  // const token = getTokenFrom(request)
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({...request.body, 
                          user: user})
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  return response.status(201).json(result)
  
})


//Retrieves all blog objects
blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog.find({})
  response.json(blogs)
})



//Deletes a specific blog object
blogsRouter.delete('/:id', async (request, response) => {
  //Checks If Token is Valid
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  //Checks if TokenUser is the Blog's creator
  const user = await User.findById(decodedToken.id)
  blogToBeChecked = await Blog.findById(request.params.id)
  if (blogToBeChecked.user.toString() === user._id.toString()) {
    //Deletes the Blog
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({error: "User not owner of Blog"})
  
  
})


//Updates a specific blog object
blogsRouter.put('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const body = request.body
  const blog = {
    title: body.content,
    author: body.important,
    url: body.url,
    likes: body.likes
  }
  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  return response.json(updatedBlog)
})



module.exports = blogsRouter
//samuel major