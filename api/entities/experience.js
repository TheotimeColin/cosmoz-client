const mongoose = require('mongoose')

let Experience = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        sequences: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'sequence' }
        ]
    }, { timestamps: true })
}

Experience.model = global.Experience ? global.Experience.model : mongoose.model('experience', Experience.fields)
global.Experience = Experience

module.exports = Experience