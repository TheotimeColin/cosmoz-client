const mongoose = require('mongoose')

let Gathering = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String },
        subtitle: { type: String },
        meetup: { type: String },
        dates: { type: Array, default: [] },
        location: { type: String },
        cover: { type: mongoose.Schema.Types.ObjectId, ref: 'mediaCollection' },
        experience: { type: mongoose.Schema.Types.ObjectId, ref: 'experience' }
    }, { timestamps: true })
}


Gathering.fields.pre('find', function () {
    this.populate('cover')
})

Gathering.model = global.Gathering ? global.Gathering.model : mongoose.model('gathering', Gathering.fields)
global.Gathering = Gathering

module.exports = Gathering