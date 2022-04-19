const mongoose = require('mongoose')

let SequenceBlock = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        cards: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'card' }
        ]
    })
}

SequenceBlock.model = global.SequenceBlock ? global.SequenceBlock.model : mongoose.model('sequenceBlock', SequenceBlock.fields)
global.SequenceBlock = SequenceBlock

module.exports = SequenceBlock