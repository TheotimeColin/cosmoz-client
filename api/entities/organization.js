const mongoose = require('mongoose')

let Organization = {
    write: 'admin',
    read: 'public',
    fields: new mongoose.Schema({
        slug: { type: String, write: 'admin' },
        name: { type: String, write: 'self', read: 'public' },
        intro: { type: String, write: 'self', read: 'public' },

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

Organization.fields.pre('findOne', function () {
    this.populate('logo')
    this.populate('cover')
})

Organization.fields.pre('find', function () {
    this.populate('logo')
    this.populate('cover')
})

Organization.model = global.Organization ? global.Organization.model : mongoose.model('organization', Organization.fields)
global.Organization = Organization

module.exports = Organization