const mongoose = require('mongoose')

const user = require('./user')
const mediaCollection = require('./media-collection')
const media = require('./media')
const token = require('./token')

const cardStep = require('./card-step')
const card = require('./card')
const sequenceBlock = require('./sequence-block')
const sequence = require('./sequence')
const experience = require('./experience')
const location = require('./location')
const gathering = require('./gathering')
const article = require('./article')

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })

exports.token = token
exports.user = user
exports.media = media
exports.mediaCollection = mediaCollection
exports.cardStep = cardStep
exports.card = card
exports.sequenceBlock = sequenceBlock
exports.sequence = sequence
exports.experience = experience
exports.location = location
exports.gathering = gathering
exports.article = article