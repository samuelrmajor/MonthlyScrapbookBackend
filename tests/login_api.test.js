const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


//...



describe('when there is initially 3 user in db', () => {
  
    beforeAll(async () => {
    await User.deleteMany({})
    for (let user of helper.initUsers) {
            await api.post('/api/users').send(user)
        }
  })

  
  
  test('login succeeds with proper credentials', async () => {
    const loginCredentials = {
      username: 'MichaelChan',
      password: 'chanchan'
    }

    result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      expect(result.body.token).toBeDefined()


  })



  test('login fails with wrong password', async () => {
    const loginCredentials = {
      username: 'MichaelChan',
      password: 'chanchan2'
    }

    result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

  })

    test('login fails with wrong user', async () => {
    const loginCredentials = {
      username: 'MichaelChan2',
      password: 'chanchan2'
    }

    result = await api
      .post('/api/login')
      .send(loginCredentials)
      .expect(401)
      .expect('Content-Type', /application\/json/)

  })



  //   test('creation fails with proper statuscode and message if username already taken', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'root',
  //     name: 'Superuser',
  //     password: 'salainen',
  //   }

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)

  //   expect(result.body.error).toContain('username must be unique')

  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd).toEqual(usersAtStart)
  // })


  // test('creation fails if username is too short', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'ab',
  //     name: 'Superuser',
  //     password: 'salainen',
  //   }

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)

  //   expect(result.body.error).toContain('is shorter than the minimum allowed length')

  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd).toEqual(usersAtStart)
  // })


  // test('creation fails if password is too short', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'bobbbbbbuy',
  //     name: 'Superuser',
  //     password: 'aa',
  //   }

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)

  //   expect(result.body.error).toContain('password too short')

  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd).toEqual(usersAtStart)
  // })



})
//samuel major