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

        let mention = await Entities.mention.model.findOne({
            gathering: gathering._id,
            target: target._id,
            owner: user._id
        })
        
        if (mention) throw Error('already-sent')

        data.mention = await Entities.mention.model.create({
            types: req.body.mentions.slice(0, 2),
            gathering: gathering._id,
            target: target._id,
            owner: user._id
        })

        if (!user.affinities.find(u => target._id.equals(u))) {
            user.affinities = [
                ...user.affinities,
                target._id
            ]
        }

        if (target.affinities.find(u => user._id.equals(u))) {
            data.match = true
            
            if (!user.constellation.find(u => target._id.equals(u))) {
                user.constellation = [
                    ...user.constellation,
                    target._id
                ]
            }

            if (!target.constellation.find(u => user._id.equals(u))) {
                target.constellation = [
                    ...target.constellation,
                    user._id
                ]
            }
        }

        await user.save()
        await target.save()
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.unmatch = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let target = await Entities.user.model.findById(req.body.target)

        if (!target) throw Error('target-user-not-found')

        user.affinities = user.affinities.filter(u => !target._id.equals(u))
        user.constellation = user.constellation.filter(u => !target._id.equals(u))

        target.constellation = target.constellation.filter(u => !user._id.equals(u))

        await user.save()
        await target.save()
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}