const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const { format, initialBlogs, nonExistingId, blogsInDb } = require('./test_helper')

beforeAll(async () => {
    await Blog.remove({})
  
    const blogObjects = initialBlogs.map(n => new Blog(n))
    await Promise.all(blogObjects.map(n => n.save()))
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('2 blogs are returned', async () => {
    const currentNotes=await blogsInDb()
    expect(currentNotes.length).toBe(2)
})

test('contains right blog', async () => {
    const currentNotes=await blogsInDb()
    const titles = currentNotes.map(r => r.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
    expect(titles).toContain('Go To.')
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: 'Cooking',
        author: 'Pete',
        url: 'www.123.com',
        likes: 2
    }

    const initial = await blogsInDb()
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const currentNotes = await blogsInDb()
    const titles = currentNotes.map(r => r.title)
  
    expect(currentNotes.length).toBe(initial.length + 1)
    expect(titles).toContain('Cooking')
})

test('blog without title and url will not be added ', async () => {
    const newBlog = {
        author: 'Pete',
        likes: 2
    }
    
    const initial = await blogsInDb()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

  
      currentNotes = await blogsInDb()
  
    expect(currentNotes.length).toBe(initial.length)
})

test('blog without likes has 0 likes ', async () => {
    const newBlog = {
        title: 'Fishing',
        author: 'Pete',
        url: 'www.123.com',
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
  
    const currentNotes = await blogsInDb()
    const likes = currentNotes.find(a => a.title==='Fishing').likes
  
    expect(likes).toBe(0)
})

afterAll(() => {
  server.close()
})