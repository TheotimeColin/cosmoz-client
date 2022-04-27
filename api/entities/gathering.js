const mongoose = require('mongoose')

let Gathering = {
    write: 'public',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, write: 'editor' },
        subtitle: { type: String, write: 'editor' },
        meetup: { type: String, write: 'editor' },
        dates: { type: Array, default: [], write: 'editor' },
        location: { type: String, write: 'editor' },
        favorites: { type: Number, default: 0, write: 'public' },
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'editor', ref: 'mediaCollection' },
        experience: { type: mongoose.Schema.Types.ObjectId, write: 'editor', ref: 'experience' }
    }, { timestamps: true })
}


Gathering.fields.pre('find', function () {
    this.populate('cover')
})

Gathering.model = global.Gathering ? global.Gathering.model : mongoose.model('gathering', Gathering.fields)
global.Gathering = Gathering

module.exports = Gathering