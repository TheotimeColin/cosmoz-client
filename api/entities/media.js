const mongoose = require('mongoose')

let Media = {
    write: 'user',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        width: { type: Number, write: 'editor' },
        height: { type: Number, write: 'editor' },
        size: { type: String, write: 'editor' },
        src: { type: String, write: 'editor' }
    }, { timestamps: true })
}


module.exports = Media