const { Factory } = require('rosie')
const faker = require('faker')
const users = require('../app/users/')
const mongoose = require('mongoose')

Factory.define('user')
  .attr('name', () => faker.lorem.words())
  .attr('email', () => faker.internet.email())
  .attr('pictureUrl', () => faker.image.imageUrl())

Factory.define('exercise')
  .attr('author', () => mongoose.Types.ObjectId())
  .attr('name', () => faker.lorem.words())
