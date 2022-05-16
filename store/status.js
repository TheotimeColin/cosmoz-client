import storeUtils from '@/utils/store'
import moment from 'moment'
import CONSTANTS from '@/utils/constants'
import { parseUser } from '@/utils/parsers'

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
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'status',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/status/post', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async react ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/status/react', params)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data.parent ? response.data.parent : response.data)
                
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
                    owner: item.owner.name ? parseUser(item.owner) : item.owner
                }
            })
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items

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
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}