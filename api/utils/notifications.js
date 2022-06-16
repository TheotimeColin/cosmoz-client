const Entities = require('../entities')
const moment = require('moment-timezone')
moment.tz.setDefault('Europe/Paris')

const createNotification = function (params = {}, user) {
    params = {
        type: 'default',
        status: null,
        gathering: null,
        constellation: null,
        action: true,
        originator: { _id: user._id, type: 'user'},
        owner: user._id,
        query: ['status', 'constellation', 'gathering'],
        ...params
    }

    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                type: params.type,
                owner: params.owner
            }
            
            if (params.query.includes('status') && params.status) query.status = params.status
            if (params.query.includes('constellation') && params.constellation) query.constellation = params.constellation
            if (params.query.includes('gathering') && params.gathering) query.gathering = params.gathering

            console.log(query)

            let existing = await Entities.notification.model.findOne({
                ...query,
                state: 'unread'
            })

            if (params.status) query.status = params.status
            if (params.constellation) query.constellation = params.constellation
            if (params.gathering) query.gathering = params.gathering

            if (params.action) {
                if (existing && !existing.origins.find(o => params.originator._id.equals(o._id))) {
                    existing.origins = [
                        ...existing.origins, params.originator
                    ]

                    await existing.save()
                } else if (!existing) {
                    await Entities.notification.model.create({
                        ...query,
                        origins: [ params.originator ]
                    })
                }
            } else if (!params.action && existing) {
                existing.origins = existing.origins.filter(o => !params.originator._id.equals(o._id))

                if (existing.origins.length > 0) {
                    await existing.save()
                } else {
                    await existing.remove()
                }
            }

            resolve(true)
        } catch (e) {
            console.error(e)
            resolve(null)
        }
    })
    
}

module.exports = {
    createNotification
}