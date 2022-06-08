
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

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
    searchItems(items, search, user) {
        items = [ ...items ]

        let sort = search.sort
        delete search.sort

        Object.keys(search).forEach(key => {
            if (typeof search[key] === 'object') {
                let entries = Object.entries(search[key])[0]
                
                if (entries[0] == '$id') {
                    items = items.filter(item => item[key] && item[key]._id == entries[1])
                } else if (entries[0] == '$in') {
                    let isString = entries[1] && entries[1][0] && typeof entries[1][0] === 'string'
                    
                    items = items.filter(item => entries[1].find(i => (isString ? i : i[key]) == item[key]))
                } else if (entries[0] == '$contains') {
                    items = items.filter(item => {
                        return item[key].find(u => u == entries[1])
                    })
                }
            } else if (key == '$in') {
                items = items.filter(item => search[key].includes(item._id))
            } else if (search[key] == '$notNull') {
                items = items.filter(item => item[key])
            } else if (search[key] == '$notSelf') {
                items = items.filter(item => user && item[key] != user._id)
            } else {
                let keyValue = Object.keys(search[key])[0]

                if (keyValue == '$isBefore' || keyValue == '$isAfter') {
                    items = items.filter(item => moment(item[key])[keyValue == '$isBefore' ? 'isBefore' : 'isAfter'](Object.values(search[key])[0]))
                } else {
                    items = items.filter(item => item[key] == search[key])
                }
            }
        })

        if (sort) {
            let key = Object.keys(sort)[0]
            let value = Object.values(sort)[0]

            items = items.sort((a, b) => {
                if (!a[key] || !b[key]) return false

                return value == 'desc' ? moment(a[key]).valueOf() - moment(b[key]).valueOf() : moment(b[key]).valueOf() - moment(a[key]).valueOf()
            })
        } else {
            items = items.sort((a, b) => a.createdAt && b.createdAt ? b.createdAt.valueOf() - a.createdAt.valueOf() : false)
        }

        return items
    }
}