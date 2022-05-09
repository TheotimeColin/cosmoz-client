const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Entities = require('../index.js')

const { generatePassword } = require('../utils/user')

let UserEntity = {
    read: 'admin',
    write: 'self',
    fields: new mongoose.Schema({
        email: { type: String, write: 'self', read: 'admin' },
        password: { type: String, write: 'self', read: 'private' },
        role: { type: String, write: 'admin', read: 'editor', default: 'guest' },
        name: { type: String, write: 'self' },

        categories: { type: Array, default: [], write: 'self', read: 'self' },
        ref: { type: String, write: 'self' },

        settings: { type: Object, write: 'self', read: 'self' },
        notifications: { type: Array, default: [], write: 'self', read: 'self' },

        attended: [
            { type: mongoose.Schema.Types.ObjectId, write: 'editor', read: 'self', ref: 'gathering' }
        ],

        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
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
    this.populate('attended')
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