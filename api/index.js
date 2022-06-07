require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose')
const multer  = require('multer');
const AWS = require('aws-sdk')
const { Nuxt, Builder } = require('nuxt')
const AutoIncrementFactory = require('mongoose-sequence');
const stripe = require('stripe')(process.env.STRIPE)
const SibApiV3Sdk = require('sib-api-v3-sdk');
let sendinBlue = SibApiV3Sdk.ApiClient.instance;
let apiKey = sendinBlue.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE

const cronHourly = require('./crons/hourly.js')

const app = express()

require('./entities/index')
const { createEntity, getEntities, deleteEntity } = require('./api/entity');
const { logUser, logOut, getUser, requestResetPassword, resetPassword, subscribeNewsletter } = require('./api/user');
const { updateBookingStatus } = require('./api/gathering');
const { sendMentions, unmatch } = require('./api/affinities');
const { getFeed, postStatus, reactStatus } = require('./api/status');

app.use(morgan('combined'))
app.use('/webhooks', express.raw({ type: "*/*" }))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(cors())

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
})

const storage = multer.diskStorage({
    destination : 'uploads/',
    limits: { fieldSize: 2 * 1024 * 1024 },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

app.locals.s3 = s3
app.locals.increment = AutoIncrementFactory(mongoose.connection)
app.locals.stripe = stripe
app.locals.sendinBlue = SibApiV3Sdk

mongoose.connection.on('error', console.error.bind(console, 'connection error:'))

mongoose.connection.once('open', async () => {
    app.get('/entities', getEntities)
    app.post('/entities', upload.single('file'), createEntity)
    app.delete('/entities', deleteEntity)

    app.post('/user', logUser)
    app.get('/user', getUser)
    app.post('/user/logout', logOut)
    app.post('/user/reset', requestResetPassword)
    app.post('/user/reset/confirm', resetPassword)
    app.post('/user/subscribe', subscribeNewsletter)

    app.post('/gathering/book', updateBookingStatus)

    app.get('/status/feed', getFeed)
    app.post('/status/post', upload.array('images', 4), postStatus)
    app.post('/status/react', reactStatus)

    app.post('/affinities/send-mentions', sendMentions)
    app.post('/affinities/remove-match', unmatch)

    cronHourly(app)
})

module.exports = app

if (require.main === module) {
    const port = process.env.PORT || 80
    app.listen(port, process.env.HOST || '0.0.0.0', () => {
        console.log(`============> API server listening on port ${port}`)
    })
}