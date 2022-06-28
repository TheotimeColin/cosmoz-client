export default {
    email (v) {
        let errors = []

        try {
            v = new URL(v)
            if (v.protocol !== 'http:' && v.protocol !== 'https:') throw 'error'
        } catch (e) {
            errors = ['Ce lien ne semble pas correct']
        }

        return { valid: errors.length == 0, errors }
    },
    password (v) {
        let errors = []

        if (v.length < 6) errors.push('Ton mot de passe doit faire au moins 6 caractères.')

        return { valid: errors.length == 0, errors }
    },
    name (v) {
        let errors = []

        if (v.length < 3) errors.push('Ton nom doit comporter au moins 3 caractères.')
        if (v.length > 16) errors.push('Ton nom ne peut pas faire plus de 16 caractères.')
        if (/[^a-zA-Z\d\s:\u00C0-\u00FF]/g.test(v)) errors.push('Ton nom ne peut pas contenir de caractères spéciaux.')

        return { valid: errors.length == 0, errors }
    },
    consteName (v) {
        let errors = []

        if (!v || v.length < 5) errors.push('Ton nom doit comporter au moins 5 caractères.')
        if (v && v.length > 26) errors.push('Ton nom ne peut pas faire plus de 26 caractères.')

        return { valid: errors.length == 0, errors }
    },
    userId (v, $store) {
        return new Promise(async resolve => {
            let errors = []

            try {
                if (v.length < 3) errors.push('Ton ID doit comporter au moins 3 caractères.')
                if (v.length > 30) errors.push('Ton ID ne peut pas faire plus de 30 caractères.')
                if (!(/^[0-9a-zA-Z\.]*$/.test(v))) errors.push('Ton ID ne peut contenir que des lettres, chiffres et points.')

                if (errors.length == 0) {
                    const existing = await $store.dispatch('user/fetch', {
                        query: { id: { '$broad': v } }
                    })

                    if (existing && existing[0] && existing[0]._id !== $store.state.auth.user._id) errors.push('Cet ID est déjà utilisé.')
                }
            } catch (e) {
                console.error(e)
                errors.push(e)
            }

            resolve({ valid: errors.length == 0, errors })
        })
    },
    slug (v) {
        let errors = []
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/

        if (format.test(v)) errors.push('Cette valeur ne peut pas contenir de caractères spéciaux.')
        if (v.length < 3) errors.push('Ton nom de boutique ne peut pas être inférieur à 3 caractères')
        if (v.length > 20) errors.push('Ton nom de boutique ne peut pas excéder 20 caractères')

        return { valid: errors.length == 0, errors }
    }
}