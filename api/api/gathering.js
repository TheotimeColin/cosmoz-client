const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')
const { authenticate, accessCheck, fieldsCheck } = require('../utils/user')
const { createMail, sendMail } = require('../utils/mailing')
const moment = require('moment-timezone')
moment.tz.setDefault('Europe/Paris')
const { uploadQR } = require('../utils/files')

exports.updateBookingStatus = async function (req, res) {
    let data = null
    let errors = []

    try {
        let user = await authenticate(req.headers)
        let gathering = await Entities.gathering.model.findOne({ _id: req.body._id })
                
        if (!user) throw Error('no-user')
        if (!gathering) throw Error('g-not-found')

        await Promise.all(req.body.users.map(async userUpdate => {
            try {
                let status = userUpdate.status

                if (user.role !== 'admin' && user.role !== 'editor') {
                    if (!user._id.equals(userUpdate._id)) {
                        throw Error('not-authorized-self')
                    } else if (status == 'ghosted') {
                        throw Error('not-authorized')
                    } else if (status == 'attending' && gathering.users.filter(u => u.status == 'attending' || u.status == 'confirmed').length >= gathering.max) {
                        throw Error('g-full')
                    }
                }

                if (status == 'attending') {
                    let sent = await sendConfirmationMail(gathering, user)
                    if (!sent) console.error('failed-mail')
                }

                if (status == 'confirmed') {
                    try {
                        let added = await createMail({
                            type: 'EVENT_CONFIRM',
                            date: moment().add(5, 'minutes'),
                            gathering: gathering._id,
                            user: userUpdate._id
                        })
                        
                        if (!added) throw Error('failed-queue-email')
                    } catch (e) {
                        console.error(e)
                    }
                }

                gathering.users = [
                    ...gathering.users.filter(u => u._id != userUpdate._id),
                    { _id: userUpdate._id, status: status }
                ]

                userUpdate = await Entities.user.model.findById(userUpdate._id)
                
                userUpdate.gatherings = userUpdate.gatherings.filter(g => !gathering._id.equals(g._id))
                userUpdate.gatherings = [
                    ...userUpdate.gatherings,
                    { _id: gathering._id, status }
                ]

                await userUpdate.save()
            } catch (e) {
                console.error(e)
            }

            return userUpdate
        }))

        if (user.role == 'admin' || user.role == 'editor') {
            await Promise.all(gathering.users.map(async userUpdate => {
                if (userUpdate.status == 'confirmed') {
                    let users = gathering.users.filter(u => u.status == 'confirmed' && u._id != userUpdate._id).map(u => u._id)

                    return await Entities.user.model.findByIdAndUpdate(userUpdate._id, {
                        ['$addToSet']: { encounters: users }
                    })
                }
            }))
        }
        
        await gathering.save()

        data = await Entities.gathering.model.findOne({ _id: gathering._id })

        let users = await Entities.user.model.find({ _id: data.users.map(u => u._id) })
        
        data.users = await Promise.all(data.users.map(async dUser => {
            let found = users.find(u => u._id.equals(dUser._id))
            let data = await fieldsCheck('read', found._doc, Entities.user, found, user)

            return {
                ...data,
                status: dUser.status
            }
        }))
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ data, errors, status: errors.length > 0 ? 0 : 1 })
}

const sendConfirmationMail = async function (gathering, user) {
    return new Promise(async (resolve, reject) => {
        let cover = gathering.cover ? gathering.cover.medias.find(m => m.size == 'm') : ''
        let qr = `gatherings/${gathering.id}/${user.id}.png`

        try {
            await req.app.locals.s3.headObject({
                Bucket: process.env.S3_BUCKET, Key: qr
            }).promise()

            qr = `https://${process.env.S3_BUCKET}.s3.eu-west-3.amazonaws.com/${qr}`
        } catch (e) {
            qr = await uploadQR(process.env.APP_URL + '/v/' + gathering.id + '?user=' + user.id, qr)
        }

        try {
            await sendMail(user, {
                template: 1,
                attachment: [
                    { name: `qr_code.png`, url: qr }
                ],
                params: {
                    date: moment(gathering.date).format('D MMMM YYYY à hh:mm'),
                    location: gathering.location,
                    name: gathering.title,
                    qr: qr,
                    image: cover ? cover.src : '',
                    link: process.env.BASE_URL + '/o/' + gathering.organization.slug + '/' + gathering.id,
                    cancel: process.env.BASE_URL + '/o/' + gathering.organization.slug + '/' + gathering.id + '?manage'
                }
            })

            resolve(true)
        } catch (e) {
            console.error(e)
            reject(false)
        }
    })
}