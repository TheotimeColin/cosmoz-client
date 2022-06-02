const mongoose = require('mongoose')
const mediaCollection = require('./media-collection')

let Constellation = {
    write: 'organizer',
    read: 'public',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'organizer' },
        name: { type: String, write: 'organizer', read: 'public' },
        intro: { type: String, write: 'organizer', read: 'public' },
        
        location: { type: String, write: 'organizer', read: 'public' },
        
        logo: { type: mongoose.Schema.Types.ObjectId, write: 'organizer',read: 'public', ref: 'mediaCollection' },
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'organizer',read: 'public', ref: 'mediaCollection' },

        members: { type: Array, default: [], write: 'organizer' },

        gatherings: [
            { type: mongoose.Schema.Types.ObjectId, write: 'organizer', read: 'public', ref: 'gathering' }
        ],
        owners: [
            { type: mongoose.Schema.Types.ObjectId, write: 'organizer', read: 'organizer', ref: 'user' }
        ]
    }, { timestamps: true })
}

Constellation.fields.pre('findOneAndUpdate', async function(next) {
    const doc = await this.findOne(this.getFilter())

    if (doc.cover && !doc.cover._id.equals(this._update.cover)) {
        await mediaCollection.model.deleteOne({ _id: doc.cover._id })
    }

    if (doc.logo && !doc.logo._id.equals(this._update.logo)) {
        await mediaCollection.model.deleteOne({ _id: doc.logo._id })
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