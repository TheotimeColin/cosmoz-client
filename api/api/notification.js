const { authenticate } = require('../utils/user')
const Entities = require('../entities')

exports.readAll = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        if (!user) throw Error('no-user')

        await Entities.notification.model.updateMany({
            owner: user._id,
            state: 'unread'
        }, {
            state: 'read'
        })

        data = await Entities.notification.model.find({
            owner: user._id
        })
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}