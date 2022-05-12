const mongoose = require('mongoose')

let Gathering = {
    write: 'public',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'editor' },
        title: { type: String, write: 'editor' },

        intro: { type: String, write: 'editor' },
        location: { type: String, write: 'editor' },
        date: { type: Date, write: 'editor' },

        description: { type: String, write: 'editor' },
        venue: { type: String, write: 'editor' },
        important: { type: String, write: 'editor' },
        information: { type: String, write: 'editor' },
       
        price: { type: Number, write: 'editor' },
        max: { type: Number, write: 'editor' },

        targets: { type: Array, default: [], write: 'editor' },
        tags: { type: Array, default: [], write: 'editor' },

        meetup: { type: String, write: 'editor' },

        status: { type: String, write: 'editor' },
        favorites: { type: Number, default: 0, write: 'public' },

        users: { type: Array, default: [], write: 'editor' },
        
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'editor', ref: 'mediaCollection' }
    }, { timestamps: true })
}

Gathering.fields.pre('findOne', function () {
    this.populate('cover')
})

Gathering.fields.pre('find', function () {
    this.populate('cover')
})

Gathering.model = global.Gathering ? global.Gathering.model : mongoose.model('gathering', Gathering.fields)
global.Gathering = Gathering

module.exports = Gathering