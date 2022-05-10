const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Entities = require('../entities')

const ROLES = {
    private: 999,
    admin: 99,
    self: 90,
    editor: 50,
    user: 25,
    guest: 10,
    public: 0
}

exports.generatePassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) reject(err)
            
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) reject(err)

                resolve(hash)
            })
        })
    })
}

exports.authenticate = async function (headers) {
    try {
        let user = null

        if (!headers['authorization']) throw Error('no-headers')

        let token = headers['authorization'].split(' ')[1]
        if (!token) throw Error('no-token')

        user = await jwt.verify(token, process.env.SECRET, (err, decoded) => {
            return new Promise (resolve => {
                let fetched = false

                if (err) throw Error('fail-token')
                fetched = Entities.user.model.findOne({ _id: decoded.id }, '-password')

                resolve(!err && fetched ? fetched : false)
            })
        })

        if (!user) throw Error('user-not-found')

        return user
    } catch (e) {
        console.warn(e)
        return null
    }
}

exports.accessCheck = function (type = 'write', entity, requested = null, user = null) {
    let granted = false
    let requester = null
    let owner = null
    let userRole = null
    let requiredRole = null

    if (entity[type] == 'self') {
        owner = requested ? requested.owner : null
        requester = user ? user._id : null

        granted = requester && owner && owner.equals(requester)
    } else {
        userRole = user ? ROLES[user.role] : 0
        requiredRole = ROLES[entity[type]]

        granted = userRole >= requiredRole
    }

    if (!granted) {
        console.warn(`access-${type}-denied`)
        console.log(entity.model)
        
        if (entity[type] == 'self') {
            console.log('requester : ' + requester + ' | owner : ' + owner)
        } else {
            console.log('required : ' + entity[type] + ' | user : ' + (user ? user.role : 'none'))
        }
    }

    return granted
}

exports.fieldsCheck = function (type = 'write', data = {}, entity, requested = null, user = null) {
    return new Promise(async (resolve, reject) => {
        let result = { ...data }
        let fields = entity.fields.obj
        let users = []

        if (requested && requested.owner && user) {
            users = await Entities.user.model.find({ _id: {
                $in: [requested.owner, user._id]
            }})
        }

        let promise = await Promise.all(Object.keys(fields).map(async key => {
            if (Array.isArray(fields[key]) ? fields[key][0][type] : fields[key][type]) {
                let granted = false
                let requiredRole = (Array.isArray(fields[key]) ? fields[key][0][type] : fields[key][type]) || 'public'

                if (requiredRole == 'self') {
                    let owner = requested ? requested.owner : null
                    let requester = user ? user._id : null

                    granted = requester && owner && owner.equals(requester)
                } else if (requiredRole == 'affinity') {
                    console.log('=================')
                    console.log('* AFFINITY *')

                    let owner = requested ? requested.owner : null
                    let requester = user ? user._id : null

                    if (requester && owner && owner.equals(requester)) {
                        granted = true
                    } else {
                        owner = users.find(u => u._id.equals(owner))
                        requester = users.find(u => u._id.equals(requester))

                        if (owner && requester && owner.affinities.find(u => u._id.equals(requester._id)) && requester.affinities.find(u => u._id.equals(owner._id))) {
                            granted = true
                        } else {
                            granted = false
                        }
                    }
                } else {
                    granted = (user ? ROLES[user.role] : 0) >= ROLES[requiredRole]
                }

                if (!granted) {
                    console.warn(key + ' not granted')
                    delete result[key]
                }
            }

            return true
        }))

        resolve(result)
    })
}