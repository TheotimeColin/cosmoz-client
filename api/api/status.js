const Entities = require('../entities')
const moment = require('moment-timezone')
moment.tz.setDefault('Europe/Paris')
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
            parent = await Entities.status.model.find({ _id: fields.parent })
            if (!parent[0]) throw Error('no-parent')
        }

        fields.content = stripHtml(fields.content).result
        fields.content = fields.content.replace(/\n/g, '<br>')

        data = await Entities.status.model.create({
            ...fields,
            owner: user._id
        })

        if (parent && parent[0]) {
            let result = [ ...parent[0].children, data ]
            parent[0].children = result.map(c => c._id)

            await parent[0].save()

            data = {
                ...data._doc,
                parent: {
                    ...parent[0]._doc,
                    children: result
                }
            }
        }
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

exports.reactStatus = async function (req, res) {
    let data = {}
    let errors = []

    try {
        let fields = req.body

        if (!fields.type || !fields._id) throw Error('missing-fields')

        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        let reaction = {
            type: req.body.type,
            owner: user._id
        }

        let status = await Entities.status.model.findByIdAndUpdate(fields._id, {
            [req.body.action ? '$addToSet' : '$pull']: { reactions: reaction }
        })
        if (!status) throw Error('status-not-found')

        let updated = await Entities.status.model.find({ _id: { $in: [fields._id, status.parent] } })
        
        data = updated.find(d => d._id.equals(fields._id))

        if (status.parent) data.parent = updated.find(d => d._id.equals(status.parent))
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
            $and: [
                {
                    $or: [
                        { gathering: { $in: user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').map(g => g._id) }},
                        { owner: user._id },
                        { owner: { $in: user.constellation } }
                    ],
                },
                { parent: null }
            ]
        })

    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}