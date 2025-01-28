const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there are initially saved blogs', async () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned in the JSON format', async () => {
        await api
            .get('/api/blogs/')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('get returns correct number of blogs', async () => {
        const response = await api.get('/api/blogs/')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    
    test('unique identifier is named id, not _id', async () => {
        const response = await api.get('/api/blogs')
    
        assert(response.body[0].hasOwnProperty('id'))
        assert(!response.body[0].hasOwnProperty('_id'))
    })

    describe('addition of a new blog', async () => {
        test('http post creates blog post', async () => {
            await api
                .post('/api/blogs')
                .send(helper.randomBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const response = await api.get('/api/blogs')
        
            assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        
            //Compare without id
            delete response.body[response.body.length - 1].id
            assert.deepStrictEqual(response.body[response.body.length - 1], helper.randomBlog)
        })
        
        test('missing likes property defaults likes to 0', async() => {
            const noLikesBlog = { ...helper.randomBlog }
            delete noLikesBlog.likes
        
            await api
                .post('/api/blogs')
                .send(noLikesBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogs = await api.get('/api/blogs')
            assert.strictEqual(blogs.body[blogs.body.length - 1].likes, 0)
        })
        
        test('blogs with no title return 400', async () => {
            const noTitleBlog = { ...helper.randomBlog }
            delete noTitleBlog.title
        
            await api
                .post('/api/blogs')
                .send(noTitleBlog)
                .expect(400)
        })
        
        test('blogs with no url return 400', async () => {
            const noUrlBlog = { ...helper.randomBlog }
            delete noUrlBlog.url
        
            await api
                .post('/api/blogs')
                .send(noUrlBlog)
                .expect(400)
        })
    })

    describe('deletion of a blog', async () => {
        test('deleting a valid id blog returns 204 and deletes from db', async () => {
            const blogs = await Blog.findOne({})
            const id = blogs.id

            //Delete by id
            await api
                .delete(`/api/blogs/${id}`)
                .expect(204)

            //Check if it exists
            const res = await Blog.findById(id)
            assert.strictEqual(res, null)
        })

        test('deleting a malformatted id blog returns 400', async () => {
            await api
                .delete('/api/blogs/12345')
                .expect(400)
        })

        test('deleting a invalid id blog returns 404', async () => {
            await api
                .delete('/api/blogs/67993e0f7dbaf1d3a702e2ef')
                .expect(404)
        })
    })

    describe('updating existing blogs', async () => {
        test('updating a malformatted id blog returns 400', async() => {
            await api
                .put(`/api/blogs/1234`)
                .send(helper.randomBlog)
                .expect(400)
        })

        test('updating an existing id blog returns 200 and returns updated data', async () => {
            const blog = await Blog.findOne({})

            const response = await api
                .put(`/api/blogs/${blog.id}`)
                .send(helper.randomBlog)
                .expect(200)

            assert.deepStrictEqual(response.body, { ...helper.randomBlog, id: blog.id.toString() })
        })
    })

    describe('calling put on non-existing id', async () => {
        test('missing likes property defaults likes to 0', async() => {
            const noLikesBlog = { ...helper.randomBlog }
            delete noLikesBlog.likes
        
            await api
                .put('/api/blogs/67993e0f7dbaf1d3a702e2ef')
                .send(noLikesBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            
            const blogs = await api.get('/api/blogs')
            assert.strictEqual(blogs.body[blogs.body.length - 1].likes, 0)
        })
        
        test('blogs with no title return 400', async () => {
            const noTitleBlog = { ...helper.randomBlog }
            delete noTitleBlog.title
        
            await api
                .put('/api/blogs/67993e0f7dbaf1d3a702e2ef')
                .send(noTitleBlog)
                .expect(400)
        })
        
        test('blogs with no url return 400', async () => {
            const noUrlBlog = { ...helper.randomBlog }
            delete noUrlBlog.url
        
            await api
                .put('/api/blogs/67993e0f7dbaf1d3a702e2ef')
                .send(noUrlBlog)
                .expect(400)
        })

        test('updating a non-existing id blog returns 201 and has the same id', async() => {
            response = await api
                .put(`/api/blogs/67993e0f7dbaf1d3a702e2ef`)
                .send(helper.randomBlog)
                .expect(201)

            assert.strictEqual(response.body.id, '67993e0f7dbaf1d3a702e2ef')
            delete response.body.id
            assert.deepStrictEqual(response.body, helper.randomBlog)
        })
    })
    
})


after(async () => {
    await mongoose.connection.close()
})