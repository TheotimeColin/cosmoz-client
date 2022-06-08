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