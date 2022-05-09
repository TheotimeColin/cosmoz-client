const mongoose = require('mongoose')

const user = require('./user')
const mediaCollection = require('./media-collection')
const media = require('./media')
const token = require('./token')

const location = require('./location')
const gathering = require('./gathering')
const article = require('./article')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.token = token
exports.user = user
exports.media = media
exports.mediaCollection = mediaCollection
exports.location = location
exports.gathering = gathering
exports.article = article