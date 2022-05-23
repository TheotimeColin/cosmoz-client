

const SendinBlue = require('sib-api-v3-sdk')
const { ErrorModel } = require('sib-api-v3-sdk')
let apiKey = SendinBlue.ApiClient.instance.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE

const ContactApi = new SendinBlue.ContactsApi()

exports.sendMail = function (user, params) {
    return new Promise(async (resolve, reject) => {
        try {
            const EmailsApi = new SendinBlue.TransactionalEmailsApi()
            let email = new SendinBlue.SendSmtpEmail()

            email.templateId = params.template
            email.to = [{ email: user.email }]
            if (params.attachment) email.attachment = params.attachment
            email.params = params.params

            const response = await EmailsApi.sendTransacEmail(email)

            resolve(true)
        } catch (e) {
            console.error(e)
            reject(e)
        }
    })
}