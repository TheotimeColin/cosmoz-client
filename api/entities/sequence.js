const mongoose = require('mongoose')

let Sequence = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        blocks: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'sequenceBlock' }
        ]
    })
}

Sequence.model = global.Sequence ? global.Sequence.model : mongoose.model('sequence', Sequence.fields)
global.Sequence = Sequence

module.exports = Sequence