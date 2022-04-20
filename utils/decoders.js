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
    }
}
