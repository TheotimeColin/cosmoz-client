import CONSTANTS from '@/utils/constants'

export default {
    gathering: {
        decode: function (form) {
            let status = form ? CONSTANTS.status.find(c => c.value == form.status) : null

            return {
                ...form,
                status: status ? status.id : 0,
                constellation: form && form.constellation ? form.constellation._id  : ''
            }
        },
        parse: async (form, $parent) => {
            return new Promise(async resolve => {
                if (form.cover && form.cover._id) {
                    form.cover = form.cover._id
                } else {
                    delete form.cover
                }

                if (form.coverSelect) {
                    let result = await $parent.$store.dispatch('library/createDirect', {
                        params: {
                            title: form.coverSelect.photographer,
                            medias: [
                                { size: 's', src: form.coverSelect.src.medium },
                                { size: 'm', src: form.coverSelect.src.large }
                            ]
                        }
                    })

                    if (result) form.cover = result._id

                    delete form.coverSelect
                }

                resolve({
                    ...form,
                    status: CONSTANTS.status.find(s => s.id == form.status).value,
                })
            })
        }
    },
    constellation: {
        decode: function (form) {

            return {
                ...form
            }
        },
        parse: async function (form) {

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
        parse: async function (form) {
            
            return {
                ...form,
                cover: form.cover ? form.cover._id : '',
                category: CONSTANTS.articleCategories[form.category].value
            }
        }
    }
}
