const mongoose = require('mongoose')

let Card = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        color: { type: String, default: 'cream' },
        steps: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'cardStep' }
        ]
    })
}

Card.model = global.Card ? global.Card.model : mongoose.model('card', Card.fields)
global.Card = Card

module.exports = Card