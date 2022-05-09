const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')

const { authenticate } = require('../utils/user')

exports.bookGathering = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findById(req.body._id).populate('cover')
        
        if (!user) throw Error('no-user')
        if (!gathering) throw Error('g-not-found')

        if (gathering.attending.length >= gathering.max) throw Error('g-full')
        if (gathering.attending.includes(user._id)) throw Error('g-already-booked')

        gathering.attending = [
            ...gathering.attending,
            user._id
        ]

        await gathering.save()

        data = gathering
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.cancelBookingGathering = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findById(req.body._id).populate('cover')
        
        if (!user) throw Error('no-user')
        if (!gathering) throw Error('g-not-found')

        if (!gathering.attending.includes(user._id)) throw Error('g-not-booked')

        gathering.attending = gathering.attending.filter(u => !u.equals(user._id))

        await gathering.save()

        data = gathering
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}