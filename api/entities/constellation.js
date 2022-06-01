const mongoose = require('mongoose')

let Constellation = {
    write: 'admin',
    read: 'public',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'admin' },
        name: { type: String, write: 'self', read: 'public' },
        intro: { type: String, write: 'self', read: 'public' },
        followers: { type: Number, default: 0, write: 'private', read: 'public' },

        location: { type: String, write: 'self', read: 'public' },
        
        logo: { type: mongoose.Schema.Types.ObjectId, write: 'self',read: 'public', ref: 'mediaCollection' },
        cover: { type: mongoose.Schema.Types.ObjectId, write: 'self',read: 'public', ref: 'mediaCollection' },

        gatherings: [
            { type: mongoose.Schema.Types.ObjectId, write: 'self', read: 'public', ref: 'gathering' }
        ],
        owners: [
            { type: mongoose.Schema.Types.ObjectId, write: 'private', read: 'private', ref: 'user' }
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