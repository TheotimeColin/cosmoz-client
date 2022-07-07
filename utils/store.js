
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

const getQuery = function (path, query) {
    return query ? `${path}?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}` : path
}

const updateOne = function (state, value) {
    let items = JSON.parse(JSON.stringify(state.items))

    if (value) items[value._id] = value

    return items
}

const deleteOne = function (state, id) {
    let items = JSON.parse(JSON.stringify(state.items))
    delete items[id]

    return items
}

const softRefresh = function (state, values) {
    let items = [...Object.values(state.items), ...values].reduce((acc, value) => {
        return { ...acc, [value._id]: value }
    }, {})

    return items
}

const refresh = function (values) {
    let items = values.reduce((acc, value) => {
        return { ...acc, [value._id]: value }
    }, {})

    return items
}

const softFetch = function (queried, $store) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = []
            let existing = JSON.parse(JSON.stringify($store.state.items))
            let alreadyFetched = false
            
            queried = [ ...new Set(queried) ]
            
            for (let item of queried) {
                if (item && !existing[item] && !alreadyFetched) {
                    let newItems = await $store.dispatch('fetch', {
                        query: { _id: { $in: queried } },
                        refresh: false
                    })

                    if (newItems) {
                        existing = newItems.reduce((acc, value) => ({ ...acc, [value._id]: value }), {})
                    }

                    // console.log(`NOT FOUND ${$store.state.type} : ${item}`)

                    // console.log('----\n\n')

                    alreadyFetched = true
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
}

const handleErrors = function (e, commit, text, parent) {
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
}

const searchItems = function (items, search, user) {
    items = [ ...items ]

    let sort = search.sort
    delete search.sort

    const searchField = function (search, items) {
        let result = [ ...items ]

        Object.keys(search).forEach(key => {
            if (typeof search[key] === 'object' && !Array.isArray(search[key]) && search[key] !== null) {
                let entries = Object.entries(search[key])[0]

                if (entries[0] == '$and') {
                    let results = entries[1].reduce((t, obj) => {
                        return searchField({ [key]: obj }, t)
                    }, result)

                    result = results
                } else if (entries[0] == '$in') {
                    let isString = entries[1] && entries[1][0] && typeof entries[1][0] === 'string'
                    
                    result = result.filter(item => entries[1].find(i => (isString ? i : i[key]) == item[key]))
                } else if (entries[0] == '$notIn') {
                    let isString = entries[1] && entries[1][0] && typeof entries[1][0] === 'string'
                    
                    result = result.filter(item => !entries[1].find(i => (isString ? i : i[key]) == item[key]))
                } else if (entries[0] == '$contains') {
                    result = result.filter(item => {
                        return item[key].find(u => u == entries[1])
                    })
                } else if (entries[0] == '$containsBroad' || entries[0] == '$broad') {
                    result = result.filter(item => {
                        if (Array.isArray(item[key]) && item[key] !== null) {
                            return item[key].find(u => u.toLowerCase() == entries[1].toLowerCase())
                        } else {
                            return item[key].toLowerCase() == entries[1].toLowerCase()
                        }
                    })
                } else if (entries[0] == '$gte') {
                    result = result.filter(item => {
                        if (moment(item[key]).isValid()) {
                            return moment(item[key]).isAfter(moment(entries[1]))
                        } else {
                            return item[key] >= entries[1]
                        }
                    })
                } else if (entries[0] == '$lte') {
                    result = result.filter(item => {
                        if (moment(item[key]).isValid()) {
                            return moment(item[key]).isBefore(moment(entries[1]))
                        } else {
                            return item[key] <= entries[1]
                        }
                    })
                }
            } else if (key == '$in') {
                result = result.filter(item => search[key].includes(item._id))
            } else if (search[key] == '$notNull') {
                result = result.filter(item => item[key])
            } else if (search[key] === null || search[key] == '$null') {
                result = result.filter(item => !item[key])
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

const baseMutations = {
    updateOne (state, value) {
        state.items = updateOne(state, value)
    },
    deleteOne (state, id) {
        state.items = deleteOne(state, id)
    },
    softRefresh (state, values) {
        state.items = softRefresh(state, values)
    },
    refresh (state, values) {
        state.items = refresh(values)
    }
}

export {
    baseMutations,
    getQuery,
    updateOne,
    deleteOne,
    softRefresh,
    refresh,
    softFetch,
    handleErrors,
    searchItems
}