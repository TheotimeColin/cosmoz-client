import storeUtils from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')
import CONSTANTS from '@/utils/constants'
import { parseUser } from '@/utils/parsers'

export default {
    namespaced: true,
    state: () => ({
        type: 'status',
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        softRefresh (state, values) {
            state.items = storeUtils.softRefresh(state, values)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
    },
    actions: {
        async fetchFeed ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get('/status/feed', { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'status',
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async get ({ commit }, _id) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities/get', {
                    _id, type: 'status'
                }))

                let result = Array.isArray(response.data) ? response.data[0] : response.data
   
                if (result) commit('updateOne', result)

                return result
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async softFetch ({ state, dispatch, commit }, items) {
            return await storeUtils.softFetch(items, { state, dispatch, commit })
        },
        async create ({ commit }, params = {}) {
            try {
                let formData = new FormData()
                
                Object.keys(params).forEach(key => {
                    if (Array.isArray(params[key])) {
                        const arrayKey = `${key}`

                        params[key].forEach(v => {
                            formData.append(arrayKey, v)
                        })
                    } else {
                        formData.append(key, params[key])
                    }
                })

                const response = await this.$axios.$post('/status/post', formData, { headers: {
                    'Content-Type': 'multipart/undefined'
                }})
                
                if (response.status == 0) throw Error(response.errors[0])
                
                if (response.data.origin) commit('updateOne', response.data.origin)
                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'status' }
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
        }
    },
    getters: {
        items: (state) => {
            return Object.values(state.items).map(item => {
                return {
                    ...item,
                    owner: (item.owner && item.owner.name) ? parseUser(item.owner) : item.owner
                }
            })
        },
        find: (state, getters, root) => (search = {}, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items

            return search ? storeUtils.searchItems(items, search, root.auth.user) : items

            if (search) {
                Object.keys(search).forEach(key => {
                    if (search[key] == '$notNull') {
                        items = items.filter(item => item[key])
                    } else if (search[key] == '$isNull') {
                        items = items.filter(item => !item[key])
                    } else if (key == '$in') {
                        items = items.filter(item => search[key].find(i => i == item._id))
                    } else {
                        items = items.filter(item => item[key] == search[key])
                    }
                })
            }

            return items.sort((a, b) => a.createdAt && b.createdAt ? moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf() : false)
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
        findOne: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values({ ...state.items }) : getters.items

            let result = storeUtils.searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
        }
    }
}