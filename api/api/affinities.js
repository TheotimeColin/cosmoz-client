const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')
const moment = require('moment')

const { authenticate } = require('../utils/user')

exports.sendMentions = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findById(req.body.gathering)
        let target = await Entities.user.model.findById(req.body.target)

        if (!gathering) throw Error('gathering-not-found')
        if (!target) throw Error('target-user-not-found')
        if (!gathering.users.find(u => target._id.equals(u._id) && u.status == 'confirmed') || !gathering.users.find(u => user._id.equals(u._id) && u.status == 'confirmed')) throw Error('users-not-connected')
        if (target.mentions.find(m => user._id.equals(m.user) && gathering._id.equals(m.gathering))) throw Error('already-sent')

        target.mentions = [
            ...target.mentions,
            { mentions: req.body.mentions.slice(0, 2), user: user._id, gathering: gathering._id }
        ]

        if (!user.affinities.find(u => target._id.equals(u))) {
            user.affinities = [
                ...user.affinities,
                target._id
            ]
        }

        data.match = target.affinities.find(u => user._id.equals(u)) ? true : false

        await user.save()
        await target.save()
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}