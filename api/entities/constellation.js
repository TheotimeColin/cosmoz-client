const mongoose = require('mongoose')
const mediaCollection = require('./media-collection')

let Constellation = {
    write: 'g-organizer',
    read: 'public',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'g-admin' },
        name: { type: String, write: 'g-admin' },
        intro: { type: String, write: 'g-admin' },
        description: { type: String, write: 'g-admin' },

        type: { type: String, default: 'group', write: 'g-admin' },
        featured: { type: Boolean, default: false, write: 'admin' },
        
        location: { type: String, write: 'g-admin' },
        
        logo: { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'mediaCollection' },
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'mediaCollection' },

        followers: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-organizer', ref: 'user' },
        ],

        members: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-organizer', ref: 'user' },
        ],

        organizers: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'user' },
        ],

        admins: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'user' },
        ],

        gatherings: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-organizer', ref: 'gathering' }
        ],
    }, { timestamps: true })
}

Constellation.fields.pre('findOneAndUpdate', async function(next) {
    const doc = await this.findOne(this.getFilter())

    if (this._update?.cover && doc.cover && !doc.cover._id.equals(this._update.cover)) {
        let media = await mediaCollection.model.findOne({ _id: doc.cover._id })
        if (media) await media.remove()
    }

    if (this._update?.logo && doc.logo && !doc.logo._id.equals(this._update.logo)) {
        let media = await mediaCollection.model.findOne({ _id: doc.logo._id })
        if (media) await media.remove()
    }

    next()
})

Constellation.fields.pre('findOne', function () {
    this.populate('logo')
    this.populate('cover')
})

Constellation.fields.pre('find', function () {
    this.populate('logo')
    this.populate('cover')
})

Constellation.model = global.Constellation ? global.Constellation.model : mongoose.model('constellation', Constellation.fields)
global.Constellation = Constellation

module.exports = Constellation