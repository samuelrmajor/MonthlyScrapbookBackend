const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
//"Michael Chan" "Edsger W. Dijkstra" "Robert C. Martin"

//Tests
const myTokens = []
describe("Blog Creation", () => {
    beforeAll(async () => {        
    await User.deleteMany({})
    const users =[]
    const newblogs = []
    for (let user of helper.initUsers) {
            let result = await api.post('/api/users').send(user)
            users.push(result.body)
        }

    for (let login of helper.initUsers) {
            delete login.name
            let result = await api.post('/api/login').send(login)
            myTokens.push(result.body)
            
        }
    for (let blog of helper.initBlogs) {
        let thisUser = users.find(n => {return n.name.toString() === blog.author})
        // blog.user = thisUser.id
        newblogs.push({...blog, user: thisUser.id.toString()})
    }
    helper.initBlogs.length = 0
    helper.initBlogs.push.apply(helper.initBlogs, newblogs)
    })


    beforeEach(async () => {
        await Blog.deleteMany({})
        for (let blog of helper.initBlogs) {
            let blogObject = new Blog(blog)
            await blogObject.save()
        }
        })


    test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initBlogs.length)
    })


    test('a valid blog wiith no token cannot be added', async () => {
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
        .expect(401) 
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
        .set('Authorization', 'bearer ' + myTokens[0].token)
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
        .set('Authorization', 'bearer ' + myTokens[0].token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    

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
        .set('Authorization', 'bearer ' + myTokens[0].token)
        .send(newBlog1)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + myTokens[0].token)
        .send(newBlog2)
        .expect(400)

    await api
        .post('/api/blogs')
        .set('Authorization', 'bearer ' + myTokens[0].token)
        .send(newBlog3)
        .expect(400)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initBlogs.length)
    
    
    
    })


    test('deletion succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        const myToken = myTokens.find(n => n.name === blogToDelete.author).token
        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer ' + myToken)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
        helper.initBlogs.length - 1
        )
        const contents = blogsAtEnd.map(r => r.id)
        expect(contents).not.toContain(blogToDelete.id)
    })



    test('put succeeds with updated object', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const resultBlog = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({...blogToUpdate, 
                likes: blogToUpdate.likes +1})
            .expect(200)

        const processedBlogToView = JSON.parse(JSON.stringify(blogToUpdate))
        expect(resultBlog.body.likes).toEqual(processedBlogToView.likes +1)
        

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
        helper.initBlogs.length
        )
        const contents = blogsAtEnd.filter(r => r.id===processedBlogToView.id)[0]

        expect(contents.likes).toEqual(processedBlogToView.likes + 1)
    })


    afterAll(() => {
    mongoose.connection.close()
    }) 
})