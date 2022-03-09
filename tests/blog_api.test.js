const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})




// //Tests
// describe('total likes', () => {

//   test('generates the total likes in a list of blogs', () => {
//     const result = listHelper.totalLikes(blogs)
//     expect(result).toBe(36)
//   })

//   test("determines the max number of likes in a list of blogs and returns that blog", () =>{
//     const result = listHelper.favoriteBlog(blogs)
//     expect(result).toEqual({
//     _id: "5a422b3a1b54a676234d17f9",
//     title: "Canonical string reduction",
//     author: "Edsger W. Dijkstra",
//     url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
//     likes: 12,
//     __v: 0
//   })

//   }
//   )
// })


test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initBlogs.length)
})


test('a valid blog can be added', async () => {
  const newBlog = {
    _id: "5a422aa71b54a676234d17f9",
    title: "Bush dogs great adventure",
    author: "samuel major",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 9001,
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initBlogs.length + 1)

    const contents = blogsAtEnd.map(n => n.author)
    expect(contents).toContain("samuel major")
  
})



test('id not _id in unique id', async () => {
  

  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
  
})




test('a new blog without likes defaults likes to equal 0', async () => {
  const newBlog = {
    _id: "5a422aa71b54a676234d17f9",
    title: "Bush dogs great adventure",
    author: "samuel major",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    __v: 0
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
 

    const blogsAtEnd = await helper.blogsInDb()

    const blogToTest = blogsAtEnd.filter(n => n.id === "5a422aa71b54a676234d17f9")[0]
   
 
    expect(blogToTest.likes).toEqual(0)
  
})



test('a new blog without title and or link will not create and return status 400', async () => {
  const newBlog1 = {
    _id: "5a422aa71b54a676234d17f9",
    author: "samuel major",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    __v: 0
  }

  const newBlog2 = {
    _id: "5a422aa71b54a676234d17f9",
    title: "Bush dogs great adventure",
    author: "samuel major",
    __v: 0
  }


  const newBlog3 = {
    _id: "5a422aa71b54a676234d17f9",
    author: "samuel major",
    __v: 0
  }



  await api
    .post('/api/blogs')
    .send(newBlog1)
    .expect(400)

await api
    .post('/api/blogs')
    .send(newBlog2)
    .expect(400)

await api
    .post('/api/blogs')
    .send(newBlog3)
    .expect(400)
 
  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(helper.initBlogs.length)
   
 
  
})






// test('a valid note can be added ', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const notesAtEnd = await helper.notesInDb()
//   expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

//   const contents = notesAtEnd.map(n => n.content)
//   expect(contents).toContain(
//     'async/await simplifies making async calls'
//   )
// })





afterAll(() => {
  mongoose.connection.close()
}) 