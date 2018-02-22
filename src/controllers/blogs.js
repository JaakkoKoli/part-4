const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
require('dotenv').config()

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  try{
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    if (!body.url || !body.title || body === undefined) {
      response.status(400).send("invalid blog")
    } else {
      if(!body.likes){
        body.likes=0
      }
      const user = await User.findById(decodedToken.id)
      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
      })
      const result = await blog.save()
      response.status(201).json(result)
    }
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'an error occurred' })
  }
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token
    const decodedToken = jwt.verify(token, process.env.SECRET)
    const blog = await Blog.findById(request.params.id)
    if (!token || !decodedToken.id ) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if(decodedToken.id.toString() !== blog.user.toString()){
      return response.status(401).json({ error: 'Only the creator can remove a blog; wrong user.' })
    }

    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const id = request.params.id
    const body = request.body
    const res = await Blog.findByIdAndUpdate({ _id: id }, new Blog(body), { new: true })
    response.json(res)

  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter