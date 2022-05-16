import storeUtils from '@/utils/store'
import moment from 'moment'

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
    },
    actions: { 
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'gathering',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'gathering'
                }))
   
                commit('updateOne', Array.isArray(response.data) ? response.data[0] : response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params, type: 'gathering'
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'gathering' }
                })

                commit('utils/addFlash', {
                    type: response.status == 1 ? 'success' : 'error'
                }, { root: true })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('deleteOne', _id)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async updateBookStatus ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/gathering/book', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    },
    getters: {
        items: (state) => {
            return Object.values(state.items).map(item => {
                let thumbnail = ''
                let hero = ''

                if (item.cover) {
                    if (item.cover.medias.find(m => m.size == 's')) thumbnail = item.cover.medias.find(m => m.size == 's').src
                    
                    if (item.cover.medias.find(m => m.size == 'm')) hero = item.cover.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item,
                    thumbnail,
                    isFull: !item.max || item.users.filter(u => u.status == 'attending' || u.status.status == 'confirmed').length >= item.max,
                    isPast: moment(item.date).isBefore(moment()),
                    display: moment(item.date).isBefore(moment()),
                    hero,
                    users: item.users.map(user => {
                        if (user.picture) {
                            if (user.picture.medias.find(m => m.size == 's')) user.profileSmall = user.picture.medias.find(m => m.size == 's').src
                            
                            if (user.picture.medias.find(m => m.size == 'm')) user.profileLarge = user.picture.medias.find(m => m.size == 'm').src
                        }

                        return user
                    })
                }
            })
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            let sort = search.sort

            delete search.sort

            if (search) {
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
            }

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
        },
        groupBy: (state, getters) => (property) => {
            let items = getters.items

            items = items.reduce((obj, item) => {
                let newObj = { ...obj }

                if (!newObj[item[property]]) {
                    newObj[item[property]] = [ item ]
                } else {
                    newObj[item[property]].push(item)
                }

                return newObj
            }, {})

            return items
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}