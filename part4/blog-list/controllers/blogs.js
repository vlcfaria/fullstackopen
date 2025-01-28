const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const blog = await new Blog(request.body)
  
    const result = await blog.save()
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    
    if (!blog) {
        return response.status(404).json({ error: 'id not found' })
    }

    response.status(204).send()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true, context: 'query' })

    if (!blog) {
        //Create resource
        const blog = new Blog({...request.body, _id: request.params.id})

        const result = await blog.save()
        return response.status(201).json(result)
    }

    response.status(200).json(blog)
})

module.exports = blogsRouter