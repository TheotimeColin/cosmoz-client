
const sharp = require('sharp')
const QRCode = require('qrcode')
const shortid = require('shortid')
const fs = require('fs')
const AWS = require('aws-sdk')

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ID,
    secretAccessKey: process.env.S3_SECRET
})

exports.uploadQR = async function (value, path) {
    return new Promise(async (resolve, reject) => {
        let srcPath = `uploads/${shortid.generate()}.png`
        
        try {
            await QRCode.toFile(srcPath, value, {
                scale: 5,
                width: 1000
            })
            
            let buffer = await sharp(srcPath).toBuffer()

            const src = await s3.putObject({
                Bucket: process.env.S3_BUCKET, Key: path, Body: buffer
            }).promise()

            fs.unlink(srcPath, () => {})

            resolve(`https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${path}`)
        } catch (e) {
            fs.unlink(srcPath, () => {})

            console.error(e)
            reject()
        }
    })
}