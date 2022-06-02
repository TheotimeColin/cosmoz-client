const mongoose = require('mongoose')
const mediaCollection = require('./media-collection')

let Gathering = {
    write: 'organizer',
    read: 'public',
    fields: new mongoose.Schema({
        id: { type: String, write: 'private' },
        title: { type: String, write: 'organizer' },

        intro: { type: String, write: 'organizer' },
        location: { type: String, write: 'organizer' },
        address: { type: String, write: 'organizer' },
        date: { type: Date, write: 'organizer' },

        description: { type: String, write: 'organizer' },
        venue: { type: String, write: 'organizer' },
        important: { type: String, write: 'organizer' },
        information: { type: String, write: 'organizer' },
       
        max: { type: Number, write: 'organizer' },
        guests: { type: Number, default: 0, write: 'organizer' },

        tags: { type: Array, default: [], write: 'organizer' },

        status: { type: String, write: 'organizer' },
        favorites: { type: Number, default: 0, write: 'public' },

        users: { type: Array, default: [], write: 'organizer' },
        
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'organizer', ref: 'mediaCollection' },

        reminded: { type: Boolean, default: false, write: 'private', read: 'private' },

        constellation: { type: mongoose.Schema.Types.ObjectId, write: 'organizer', ref: 'constellation' },
    }, { timestamps: true })
}

Gathering.fields.pre('findOneAndUpdate', async function(next) {
    const doc = await this.findOne(this.getFilter())

    if (doc.cover && !doc.cover._id.equals(this._update.cover)) {
        await mediaCollection.model.deleteOne({ _id: doc.cover._id })
    }

    next()
})

Gathering.fields.pre('findOne', function () {
    this.populate('cover')
    this.populate('constellation')
})

Gathering.fields.pre('find', function () {
    this.populate('cover')
    this.populate('constellation')
})

Gathering.model = global.Gathering ? global.Gathering.model : mongoose.model('gathering', Gathering.fields)
global.Gathering = Gathering

module.exports = Gathering