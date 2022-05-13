const Entities = require('../entities')
const moment = require('moment')
const { stripHtml } = require('string-strip-html')

const { authenticate } = require('../utils/user')

exports.postStatus = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let fields = req.body
        let parent = null

        if (!fields.content || !stripHtml(fields.content).result) throw Error('no-content')

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

        fields.content = stripHtml(fields.content).result
        fields.content = fields.content.replace(/\n/g, '<br>')

        data = await Entities.status.model.create({
            ...fields,
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

exports.getFeed = async function (req, res) {
    let data = []
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        data = await Entities.status.model.find({
            $or: [
                { gathering: { $in: user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').map(g => g._id) }}
            ]
        })

    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}