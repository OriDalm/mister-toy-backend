export const userService = {
  add,
  getById,
  query,
  getLoginToken,
  validateToken,
  checkLogin,
}

function checkLogin({ username, password }) {
  return db
    .collection('users')
    .findOne({ username, password })
    .then((user) => {
      if (user) {
        user = {
          _id: user._id,
          fullname: user.fullname,
          score: user.score,
          isAdmin: user.isAdmin,
        }
      }
      return user
    })
}

function getLoginToken(user) {
  return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
  if (!loginToken) return null
  const json = cryptr.decrypt(loginToken)
  const loggedinUser = JSON.parse(json)
  return loggedinUser
}

function query() {
  return db
    .collection('users')
    .find({})
    .project({ _id: 1, fullname: 1, score: 1 })
    .toArray()
    .then((users) => {
      return users
    })
}

function getById(userId) {
  return db
    .collection('users')
    .findOne({ _id: ObjectId(userId) })
    .then((user) => {
      if (user) {
        user = {
          _id: user._id,
          fullname: user.fullname,
          score: user.score,
        }
      }
      return user
    })
}

function add({ fullname, username, password }) {
  const user = {
    _id: new ObjectId(),
    fullname,
    username,
    password,
    score: 1000,
  }

  return db
    .collection('users')
    .insertOne(user)
    .then(() => {
      return { _id: user._id, fullname: user.fullname }
    })
}
