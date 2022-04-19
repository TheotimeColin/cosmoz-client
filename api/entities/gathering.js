const mongoose = require('mongoose')

let Gathering = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        dateStart: { type: Date },
        location: { type: mongoose.Schema.Types.ObjectId, ref: 'location' },
        experience: { type: mongoose.Schema.Types.ObjectId, ref: 'experience' }
    }, { timestamps: true })
}

Gathering.model = global.Gathering ? global.Gathering.model : mongoose.model('gathering', Gathering.fields)
global.Gathering = Gathering

module.exports = Gathering