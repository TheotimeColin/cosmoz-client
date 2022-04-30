import CONSTANTS from '@/utils/constants'

export default {
    gathering: {
        decode: function (form) {
            return form
        },
        parse: function (form) {
            
            return {
                ...form,
                cover: form.cover ? form.cover._id : ''
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
