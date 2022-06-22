const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Entities = require('../index.js')

const { generatePassword } = require('../utils/user')

let UserEntity = {
    read: 'public',
    write: 'self',
    fields: new mongoose.Schema({
        id: { type: String, write: 'private' },
        handle: { type: String, write: 'private', read: 'public' },
        alias: { type: String, write: 'self', read: 'public' },
        name: { type: String, write: 'self', read: 'public', fallback: { alias: 'encountered' } },

        email: { type: String, write: 'admin', read: 'admin' },
        password: { type: String, write: 'admin', read: 'private' },
        role: { type: String, write: 'admin', read: 'editor', default: 'guest' },

        birthdate: { type: Date, write: 'self', read: 'self' },
        interests: { type: Array, default: [], write: 'self', read: 'friends' },

        picture: { type: mongoose.Schema.Types.ObjectId, write: 'self', read: 'encountered', ref: 'mediaCollection' },

        ref: { type: String, write: 'self' },
        referral: { type: String, write: 'self' },

        settings: { type: Object, write: 'self', read: 'self' },
        notifications: { type: Array, default: [], write: 'self', read: 'self' },
        mentions: { type: Array, default: [], write: 'private', read: 'user' },
        gatherings: { type: Array, default: [], write: 'self', read: 'self' },

        affinities: [
            { type: mongoose.Schema.Types.ObjectId, write: 'editor', read: 'self', ref: 'user' }
        ],

        encounters: [
            { type: mongoose.Schema.Types.ObjectId, write: 'editor', read: 'self', ref: 'user' }
        ],

        isEncountered: { type: Boolean, default: false, write: 'private', read: 'public', replace: { encounters: '$requester' } },

        friends: [
            { type: mongoose.Schema.Types.ObjectId, write: 'editor', read: 'self', ref: 'user' }
        ],

        constellations: [
            { type: mongoose.Schema.Types.ObjectId, write: 'editor', read: 'self', ref: 'constellation' }
        ],

        isFriend: { type: Boolean, default: false, write: 'private', read: 'public', replace: { friends: '$requester' } },

        tidbits: { type: Array, default: [], write: 'self', read: '$readEach' },

        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    }, { timestamps: true })
}

UserEntity.fields.pre('save', async function(next) {
    var user = this

    if (!user.isModified('password')) return next()

    let hash = await generatePassword(user.password)
    user.password = hash

    next()
})

UserEntity.fields.pre('find', function () {
    this.populate('picture')
})

UserEntity.fields.methods.comparePassword = function(candidatePassword) {
    return new Promise(resolve => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            resolve(isMatch, err)
        })
    })
    
}

UserEntity.model = global.UserEntity ? global.UserEntity.model : mongoose.model('user', UserEntity.fields)
global.UserEntity = UserEntity

module.exports = UserEntity