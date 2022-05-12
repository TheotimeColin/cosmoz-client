const mongoose = require('mongoose')

const media = require('./media')
const mediaCollection = require('./media-collection')
const user = require('./user')
const token = require('./token')

const location = require('./location')
const gathering = require('./gathering')
const article = require('./article')
const status = require('./status')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.media = media
exports.mediaCollection = mediaCollection
exports.token = token
exports.user = user
exports.location = location
exports.gathering = gathering
exports.article = article
exports.status = status