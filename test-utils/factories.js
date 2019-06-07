const { Factory } = require('rosie')
const faker = require('faker')

Factory.define('user')
  .attr('name', () => faker.lorem.words())
  .attr('email', () => faker.internet.email())
  .attr('pictureUrl', () => faker.image.imageUrl())
