const mongoose = require('mongoose')

const User = require('./user')
const MediaCollection = require('./media-collection')
const Media = require('./media')
const Token = require('./token')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.token = Token
exports.user = User
exports.media = Media
exports.mediaCollection = MediaCollection