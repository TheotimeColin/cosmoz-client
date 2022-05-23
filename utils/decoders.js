import CONSTANTS from '@/utils/constants'

export default {
    gathering: {
        decode: function (form) {
            let status = form ? CONSTANTS.status.find(c => c.value == form.status) : null

            return {
                ...form,
                status: status ? status.id : 0,
                organization: form && form.organization ? form.organization._id  : ''
            }
        },
        parse: function (form) {
            
            return {
                ...form,
                cover: form.cover ? form.cover._id : '',
                price: form.price ? parseInt(form.price) : 0,
                status: CONSTANTS.status[form.status].value,
            }
        }
    },
    organization: {
        decode: function (form) {

            return {
                ...form
            }
        },
        parse: function (form) {

            return {
                ...form,
                cover: form.cover ? form.cover._id : '',
                logo: form.logo ? form.logo._id : '',
            }
        }
    },
    article: {
        decode: function (form) {
            let cat = form ? CONSTANTS.articleCategories.find(c => c.value == form.category) : null

            return {
                ...form,
                category: cat ? cat.id : 0
            }
        },
        parse: function (form) {
            
            return {
                ...form,
                cover: form.cover ? form.cover._id : '',
                category: CONSTANTS.articleCategories[form.category].value
            }
        }
    }
}
