const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')

exports.bookGathering = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findById(req.body._id)

        if (!user) throw Error('no-user')
        if (!gathering) throw Error('g-not-found')

        if (gathering.users.filter(u => u.status == 'attending').length >= gathering.max) throw Error('g-full')
        if (gathering.users.find(u => u._id.equals(user._id))) throw Error('g-already-booked')

        gathering.users = [
            ...gathering.users,
            { _id: user._id, status: 'attending' }
        ]

        await gathering.save()

        data = await Entities.gathering.model.find({ _id: gathering._id })
        data = data[0]
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.updateBookingStatus = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findById(req.body._id)
                
        if (!user) throw Error('no-user')
        if (!gathering) throw Error('g-not-found')

        req.body.users.forEach(userUpdate => {
            let authorized = true

            if (user.role !== 'admin' && user.role != 'editor') {
                if (!user._id.equals(userUpdate._id)) {
                    throw Error('not-authorized-self')
                } else if (userUpdate.status == 'ghosted' || userUpdate.status == 'confirmed') {
                    throw Error('not-authorized')
                } else if (userUpdate.status == 'attending' && gathering.users.filter(u => u.status == 'attending' || u.status == 'confirmed').length >= gathering.max) {
                    throw Error('g-full')
                }
            }

            gathering.users = [
                ...gathering.users.filter(u => u._id != userUpdate._id),
                { _id: userUpdate._id, status: userUpdate.status }
            ]
        })
        
        await gathering.save()

        data = await Entities.gathering.model.find({ _id: gathering._id })
        data = data[0]

        let users = await Entities.user.model.find({ _id: data.users.map(u => u._id) })
        
        data.users = data.users.map(dUser => {
            let found = users.find(u => u._id.equals(dUser._id))

            return {
                ...fieldsCheck('read', found._doc, Entities.user, null, user),
                status: dUser.status
            }
        })
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}