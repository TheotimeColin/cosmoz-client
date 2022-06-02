const mongoose = require('mongoose')
const AWS = require('aws-sdk')
const Media = require('./media')

Media.model = mongoose.model('media', Media.fields)
global.Media = Media

let MediaCollection = {
    write: 'user',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        medias: { type: Array, default: [] },
    }, { timestamps: true })
}

MediaCollection.fields.post('findOneAndDelete', async function (doc, next) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    })

    await Promise.all(doc.medias.map(async media => {
        s3.deleteObject({
            Bucket: process.env.S3_BUCKET, Key: media.id
        }, (e) => {
            console.log(e)
        })

        return true
    }))
    
    next()
})

MediaCollection.model = global.MediaCollection ? global.MediaCollection.fields : mongoose.model('mediaCollection', MediaCollection.fields)

MediaCollection.model = mongoose.model('mediaCollection', MediaCollection.fields)
global.MediaCollection = MediaCollection

module.exports = MediaCollection