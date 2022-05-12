const mongoose = require('mongoose')

let Status = {
    write: 'user',
    read: 'user',
    fields: new mongoose.Schema({
        content: { type: String, write: 'user' },
        attachments: { type: Array, default: [], write: 'user' },
        reactions: { type: Array, default: [], write: 'user' },

        children: [
            { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'status' }
        ],
        gathering: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'gathering' },
        parent: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'status' },
        owner: { type: mongoose.Schema.Types.ObjectId, write: 'private', read: '$user', ref: 'user' }
    }, { timestamps: true })
}


Status.fields.pre('find', function () {
    this.populate('owner')
})

Status.model = global.Status ? global.Status.model : mongoose.model('status', Status.fields)
global.Status = Status

module.exports = Status