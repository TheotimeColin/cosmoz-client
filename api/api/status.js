const Entities = require('../entities')
const moment = require('moment')

const { authenticate } = require('../utils/user')

exports.postStatus = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let fields = req.body
        let parent = null

        if (!fields.content) throw Error('no-content')

        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        if (fields.gathering) {
            let gathering = await Entities.gathering.model.findById(fields.gathering)

            if (!gathering) throw Error('no-gathering')

            // further checks
        }

        if (fields.parent) {
            parent = await Entities.status.model.findById(fields.parent)
            if (!parent) throw Error('no-parent')
        }

        data = await Entities.status.model.create({
            ...fields,
            content: fields.content.replace(/[\\$'"]/g, "\\$&"),
            owner: user._id
        })

        if (parent) {
            parent.children = [ ...parent.children, data._id ]
            await parent.save()
        }

        data.owner = user
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}