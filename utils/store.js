
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
    softRefresh (state, values) {
        let items = [...Object.values(state.items), ...values].reduce((acc, value) => {
            return { ...acc, [value._id]: value }
        }, {})

        return items
    },
    refresh (values) {
        let items = values.reduce((acc, value) => {
            return { ...acc, [value._id]: value }
        }, {})

        return items
    },
    softFetch (queried, $store) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = []
                let existing = JSON.parse(JSON.stringify($store.state.items))

                for (let item of queried) {
                    if (!existing[item]) {
                        let newItems = await $store.dispatch('fetch', {
                            query: { _id: { $in: queried } },
                            refresh: false
                        })

                        if (newItems) {
                            existing = newItems.reduce((acc, value) => ({ ...acc, [value._id]: value }), {})
                        }
                    }

                    if (existing[item]) result = [ ...result, existing[item] ]
                }
                
                $store.commit('softRefresh', result)

                resolve(result)
            } catch (e) {
                console.error(e)
                reject([])
            }
        })
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

        const searchField = function (search, items) {
            let result = [ ...items ]

            Object.keys(search).forEach(key => {
                if (typeof search[key] === 'object') {
                    let entries = Object.entries(search[key])[0]
                    
                    if (entries[0] == '$in') {
                        let isString = entries[1] && entries[1][0] && typeof entries[1][0] === 'string'
                        
                        result = result.filter(item => entries[1].find(i => (isString ? i : i[key]) == item[key]))
                    } else if (entries[0] == '$contains') {
                        result = result.filter(item => {
                            return item[key].find(u => u == entries[1])
                        })
                    }
                } else if (key == '$in') {
                    result = result.filter(item => search[key].includes(item._id))
                } else if (search[key] == '$notNull') {
                    result = result.filter(item => item[key])
                } else if (search[key] == '$notSelf') {
                    result = result.filter(item => user && item[key] != user._id)
                } else {
                    let keyValue = Object.keys(search[key])[0]
    
                    if (keyValue == '$isBefore' || keyValue == '$isAfter') {
                        result = result.filter(item => moment(item[key])[keyValue == '$isBefore' ? 'isBefore' : 'isAfter'](Object.values(search[key])[0]))
                    } else {
                        result = result.filter(item => item[key] == search[key])
                    }
                }
            })

            return result
        }

        if (search.$or) {
            let results = Object.keys(search.$or).map(key => {
                return searchField({ [key]: search.$or[key] }, items)
            })
            
            items = [...new Set(results.reduce((total, current) => [...total, ...current], []))]
        } else {
            items = searchField(search, items)
        }

        if (sort) {
            let key = Object.keys(sort)[0]
            let value = Object.values(sort)[0]

            items = items.sort((a, b) => {
                if (!a[key] || !b[key]) return false

                return value == 'desc' ? moment(a[key]).valueOf() - moment(b[key]).valueOf() : moment(b[key]).valueOf() - moment(a[key]).valueOf()
            })

            if (sort.reverse) items = items.reverse()
        } else {
            items = items.sort((a, b) => a.createdAt && b.createdAt ? b.createdAt.valueOf() - a.createdAt.valueOf() : false)
        }

        return items
    }
}