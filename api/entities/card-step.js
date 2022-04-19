const mongoose = require('mongoose')

let CardStep = {
    write: 'editor',
    read: 'public',
    fields: new mongoose.Schema({
        title: { type: String, default: '', write: 'editor' },
        subtitle: { type: String, default: '', write: 'editor' },
        sections: { type: Array, default: [], write: 'editor' },
        choices: { type: Array, default: [], write: 'editor' },
    }, { timestamps: true })
}

CardStep.model = global.CardStep ? global.CardStep.model : mongoose.model('cardStep', CardStep.fields)
global.CardStep = CardStep

module.exports = CardStep