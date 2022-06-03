const mongoose = require('mongoose')
const mediaCollection = require('./media-collection')

let Constellation = {
    write: 'g-organizer',
    read: 'public',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'g-admin' },
        name: { type: String, write: 'g-admin' },
        intro: { type: String, write: 'g-admin' },
        
        location: { type: String, write: 'g-admin' },
        
        logo: { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'mediaCollection' },
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'g-admin', ref: 'mediaCollection' },

        members: { type: Array, default: [], write: 'g-organizer' },
        organizers: { type: Array, default: [], write: 'g-admin' },
        admins: { type: Array, default: [], write: 'g-admin' },

        gatherings: [
            { type: mongoose.Schema.Types.ObjectId, write: 'g-organizer', ref: 'gathering' }
        ],
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