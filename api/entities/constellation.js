const mongoose = require('mongoose')

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