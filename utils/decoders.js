import CONSTANTS from '@/utils/constants'

export default {
    user: {
        decode: function (form) {

            return {
                ...form
            }
        },
        parse: async (form, $parent) => {
            return new Promise(async resolve => {
                if (form.picture && form.picture._id) {
                    form.picture = form.picture._id
                } else {
                    delete form.picture
                }

                if (form.removePicture) form.picture = null

                if (form.newPicture) {
                    let result = await $parent.$store.dispatch('library/create', {
                        file: form.newPicture,
                        size: 'profile',
                        path: '$user/profile'
                    })

                    if (result) form.picture = result._id

                    delete form.newPicture
                }

                resolve({
                    ...form
                })
            })
        }
    },
    gathering: {
        decode: function (form) {
            let status = form ? CONSTANTS.status.find(c => c.value == form.status) : null
            
            return {
                ...form,
                status: status ? status.value : 'draft',
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
                    ...form
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
        parse: async function (form, $parent) {
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

            if (form.logoSelect) {
                let result = await $parent.$store.dispatch('library/create', {
                    file: form.logoSelect,
                    path: `constellation/${$parent.currentId}/logo`
                })

                if (result) form.logo = result._id
            }

            if (form.cover) form.cover = form.cover._id ? form.cover._id : form.cover
            if (form.logo) form.logo = form.logo._id ? form.logo._id : form.logo

            return form
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
