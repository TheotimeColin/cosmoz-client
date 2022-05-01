import CONSTANTS from '@/utils/constants'

export default {
    gathering: {
        decode: function (form) {
            let status = form ? CONSTANTS.status.find(c => c.value == form.status) : null

            return {
                ...form,
                status: status ? status.id : 0
            }
        },
        parse: function (form) {
            
            return {
                ...form,
                cover: form.cover ? form.cover._id : '',
                status: CONSTANTS.status[form.status].value
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
