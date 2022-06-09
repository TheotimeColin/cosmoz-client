const mongoose = require('mongoose')
const { nanoid }  = require('nanoid')
const Entities = require('../entities')
const moment = require('moment-timezone')
moment.tz.setDefault('Europe/Paris')


const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.consteApply = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        let constellation = await Entities.constellation.model.updateOne({ _id: req.body.id }, { $addToSet: { followers: user._id }})

        if (!constellation) throw Error('no-constellation')

        data = await Entities.constellation.model.findOne({ _id: req.body.id })
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.consteEnter = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        let conste = await Entities.constellation.model.findOne({ _id: req.body.conste })

        if (!conste) throw Error('no-constellation')
        if (!req.body.token && ![...conste.organizers, ...conste.admins].find(m => user._id.equals(m))) throw Error('not-authorized')

        if (req.body.token) {
            let token = await Entities.token.model.findOne({ id: req.body.token })

            if (!token || !token.constellation.equals(req.body.conste)) throw Error('token-invalid')

            req.body.user = user._id
        }

        await Entities.constellation.model.updateOne({ _id: req.body.conste }, {
            $addToSet: { members: mongoose.Types.ObjectId(req.body.user) },
            $pull: { followers: mongoose.Types.ObjectId(req.body.user) }
        })

        data = await Entities.constellation.model.findOne({ _id: req.body.conste })

        data = await fieldsCheck('read', data._doc, Entities.constellation, data, user)
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.consteInviteLink = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        let constellation = await Entities.constellation.model.findOne({ _id: req.body.id })

        if (!constellation) throw Error('no-constellation')

        if (user.role !== 'admin' && !constellation.admins.find(u => user._id.equals(u))) throw Error('not-authorized')

        let id = nanoid()
        let token = await Entities.token.model.create({
            id, read: 'g-admin',
            type: 'invite',
            constellation: constellation._id
        })

        data.token = id
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.consteLeave = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        let constellation = await Entities.constellation.model.updateOne({ _id: req.body.id }, { $pull: { followers: user._id, members: user._id, organizers: user._id }})

        if (!constellation) throw Error('no-constellation')

        data = await Entities.constellation.model.findOne({ _id: req.body.id })
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}