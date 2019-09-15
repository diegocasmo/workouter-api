const UserModel = require('./model')
const { OAuth2Client } = require('google-auth-library')

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET } = process.env
const client = new OAuth2Client(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET)

// Find or create a new user in DB from the authentication ID token
const findOrCreateAuthUser = async idToken => {
  const user = await getUserFromToken(idToken)
  return findOrCreateUser(user)
}

// Retrieve user given an ID token
const getUserFromToken = async idToken => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: OAUTH_CLIENT_ID,
  })
  const { name, email, picture } = ticket.getPayload()
  return { name, email, pictureUrl: picture }
}

// Find a user in DB by `email`
const findUserByEmail = async email => UserModel.findOne({ email })

// Find a user in DB by `_id`
const findUserById = async id => UserModel.findOne(id)

// Find a user if one exists, create a new one otherwise
const findOrCreateUser = async attrs => {
  const user = await findUserByEmail(attrs.email)
  return user ? user : UserModel(attrs).save()
}

module.exports = {
  findUserByEmail,
  findUserById,
  findOrCreateAuthUser,
}
