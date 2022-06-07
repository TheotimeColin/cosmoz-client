const mongoose = require('mongoose')
const Entities = require('../index.js')

let Status = {
    write: 'user',
    read: 'user',
    fields: new mongoose.Schema({
        read: { type: String, default: 'friend', write: 'self' },

        content: { type: String, write: 'user', read: '$read' },
        attachments: { type: Array, default: [], write: 'user', read: '$read' },
        reactions: { type: Array, default: [], write: 'user', read: '$read' },

        children: [
            { type: mongoose.Schema.Types.ObjectId, write: 'private', read: '$read', ref: 'status' }
        ],

        constellation: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'constellation' },

        gathering: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'gathering' },

        parent: { type: mongoose.Schema.Types.ObjectId, write: 'private', ref: 'status' },

        owner: { type: mongoose.Schema.Types.ObjectId, write: 'private', read: 'user', ref: 'user' }
    }, { timestamps: true })
}


Status.fields.pre('find', function () {
    this.populate('children')
})

Status.model = global.Status ? global.Status.model : mongoose.model('status', Status.fields)
global.Status = Status

module.exports = Status