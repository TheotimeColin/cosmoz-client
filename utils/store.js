
import moment from 'moment'

export default {
    getCollection (items) {
        return Object.keys(items).map(key => items[key])
    },
    getQuery (path, query) {
        return query ? `${path}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}` : path
    },
    updateOne (state, value) {
        let items = JSON.parse(JSON.stringify(state.items))
        items[value._id] = value

        return items
    },
    deleteOne (state, id) {
        let items = JSON.parse(JSON.stringify(state.items))
        delete items[id]

        return items
    },
    refresh (values) {
        let items = values.reduce((acc, value) => {
            return { ...acc, [value._id]: value }
        }, {})

        return items
    },
    handleErrors: (e, commit, text, parent) => {
        let message = e.message
        let errorText = message
        
        e = Array.isArray(e) ? e : [ e ]

        if (message && parent && `errors.default['${message}']` !== parent.$i18n.t(`errors.default['${message}']`)) errorText = parent.$i18n.t(`errors.default['${message}']`)

        e.forEach(e => {
            commit('flashes/add', {
                title: text,
                text: errorText
            }, { root: true })

            console.error(e)
        })

        return { status: 0, code: message, error: errorText }
    },
    searchItems(items, search) {
        items = [ ...items ]

        Object.keys(search).forEach(key => {
            if (search[key] == '$notNull') {
                items = items.filter(item => item[key])
            } else if (key == '$in') {
                items = items.filter(item => search[key].find(i => i._id == item._id))
            } else {
                let keyValue = Object.keys(search[key])[0]

                if (keyValue == '$isBefore' || keyValue == '$isAfter') {
                    items = items.filter(item => moment(item[key])[keyValue == '$isBefore' ? 'isBefore' : 'isAfter'](Object.values(search[key])[0]))
                } else {
                    items = items.filter(item => item[key] == search[key])
                }
            }
        })

        return items
    }
}