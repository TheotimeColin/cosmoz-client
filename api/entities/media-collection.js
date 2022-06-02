const mongoose = require('mongoose')
const AWS = require('aws-sdk')

let MediaCollection = {
    write: 'user',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        medias: { type: Array, default: [] },
    }, { timestamps: true })
}

MediaCollection.fields.pre('deleteOne', { document: true, query: false }, async function (next) {
    const doc = this

    if (doc && doc.medias) {
        const s3 = new AWS.S3({
            accessKeyId: process.env.S3_ID,
            secretAccessKey: process.env.S3_SECRET
        })

        await Promise.all(doc.medias.map(async media => {
            if (media.id) {
                s3.deleteObject({
                    Bucket: process.env.S3_BUCKET, Key: media.id
                }, (e) => {
                    console.log(e)
                })
            }

            return true
        }))
    }

    next()
})

MediaCollection.fields.pre('remove', async function (next) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    })

    console.log(this)

    if (this.medias) {
        await Promise.all(this.medias.map(async media => {
            if (media.id) {
                s3.deleteObject({
                    Bucket: process.env.S3_BUCKET, Key: media.id
                }, (e) => {
                    console.log(e)
                })
            }

            return true
        }))
    }

    next()
})

MediaCollection.model = global.MediaCollection ? global.MediaCollection.fields : mongoose.model('mediaCollection', MediaCollection.fields)

MediaCollection.model = mongoose.model('mediaCollection', MediaCollection.fields)
global.MediaCollection = MediaCollection

module.exports = MediaCollection