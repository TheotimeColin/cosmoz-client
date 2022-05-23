const jwt = require('jsonwebtoken')
const { $fetch } = require('ohmyfetch/node')
const Entities = require('../entities')
const shortid = require('shortid')
const moment = require('moment')
const { sendMail } = require('../utils/mailing')

const { authenticate } = require('../utils/user')
const { ErrorModel } = require('sib-api-v3-sdk')

exports.logUser = async function (req, res) {
    let errors = []
    let data = null
    let token = null

    try {
        let register = req.body.type == 'register'
        let authenticated = false
        let user = null

        if (!req.body.email || !req.body.password || !req.body.token) throw Error('missingFields')
        
        if (process.env.RECAPTCHA_BYPASS != "true") {
            const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)

            if (!challenge.success) throw Error('challenge-failed')
        }

        user = await Entities.user.model.findOne({ email: req.body.email })
        
        if (register && user) throw Error('alreadyRegistered')
        if (!register && !user) throw Error('emailNotFound')
        
        if (user) {
            authenticated = await user.comparePassword(req.body.password)
        } else if (register) {
            user = await Entities.user.model.create({
                id: shortid.generate(),
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                surname: req.body.surname,
                address: req.body.address,
                address2: req.body.address2,
                postalCode: req.body.postalCode,
                city: req.body.city,
                country: req.body.country,
                role: 'user'
            })

            user.owner = user._id
            user.save()
            
            if (!user) throw Error('error')

            authenticated = true

            try {
                let apiInstance = new req.app.locals.sendinBlue.ContactsApi()
                let createContact = new req.app.locals.sendinBlue.CreateContact()

                createContact.email = req.body.email
                createContact.listIds = [3, 5]

                createContact.attributes = {
                    PRENOM: req.body.name
                }
                
                if (process.env.NODE_ENV == "PRODUCTION") await apiInstance.createContact(createContact)
            } catch (e) {
                console.error(e)
            }
        }

        if (authenticated) {
            token = jwt.sign({ id: user._id }, process.env.SECRET, {
                expiresIn: 864000
            })
        } else {
            throw Error('wrongCredentials')
        }
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({
        data, errors, token,
        status: errors.length > 0 ? 0 : 1
    })
}

exports.getUser = async function (req, res) {
    let errors = []
    let user = null

    try {
        user = await authenticate(req.headers)
        if (!user) throw Error('wrongCredentials')
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({
        user, status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.logOut = async function (req, res) {
    let errors = []

    res.send({
        token: null, status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.requestResetPassword = async function (req, res) {
    let errors = []
    
    try {
        let user = await Entities.user.model.findOne({ email: req.body.email })

        if (!user) throw Error('user-not-found')

        let token = await Entities.token.model.create({
            id: shortid.generate(),
            value: req.body.email,
            expiration: moment().add(2, 'days').toDate()
        })

        await sendMail(user, {
            template: 2,
            params: {
                LINK: `${process.env.BASE_URL}/compte/reset?token=${token.id}`
            }
        })
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.resetPassword = async function (req, res) {
    let errors = []
    
    try {
        let token = await Entities.token.model.findOne({
            id: req.body.token
        })
        
        if (!token) throw Error('token-expired')

        await Entities.token.model.findByIdAndDelete(token._id)

        let user = await Entities.user.model.findOne({ email: token.value })

        if (!user) throw Error('user-not-found')

        user.password = req.body.password
        user.save()
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({
        status: errors.length > 0 ? 0 : 1,
        errors
    })
}

exports.subscribeNewsletter = async function (req, res) {
    let errors = []

    try {
        if (process.env.RECAPTCHA_BYPASS != "true") {
            const challenge = await $fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${req.body.token}`)

            if (!challenge.success) throw Error('challenge-failed')
        }

        user = await Entities.user.model.findOne({ email: req.body.email })
        if (!user) {
            user = await Entities.user.model.create({
                email: req.body.email,
                name: req.body.name,
                referral: req.body.referral,
                ref: req.body.ref,
                role: 'user'
            })

            user.owner = user._id
            user.save()
        } else {
            throw Error('already-subscribed')
        }

        let apiInstance = new req.app.locals.sendinBlue.ContactsApi()
        let createContact = new req.app.locals.sendinBlue.CreateContact()

        createContact.email = req.body.email
        createContact.listIds = [3, 4]

        createContact.attributes = {
            PRENOM: req.body.name
        }

        try {
            let fetch = await $fetch(encodeURI(`https://wirepusher.com/send?id=${process.env.WIRE_PUSHER}&title=${req.body.name} s'est abonné(e)&message=${req.body.email}&type=subscriber`))
        } catch (e) {
            console.error(e)
        }

        if (process.env.NODE_ENV == "PRODUCTION") await apiInstance.createContact(createContact)
    } catch (e) {
        console.error(e)
        errors.push(e.message)
    }

    res.send({ errors, status: errors.length > 0 ? 0 : 1 })
}