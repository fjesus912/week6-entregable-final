const User = require("../../models/User")

const userCreate = async() => {
  await User.create(
    {
      firstName: 'Fernando',
      lastName: 'de Jesús',
      email: 'fernando@gmail.com',
      password: 'fernando1234',
      phone: '+341234567890'
    }
  )
}

module.exports = userCreate