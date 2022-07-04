import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')
import CONSTANTS from '@/utils/constants'
import { parseUser } from '@/utils/parsers'

export default {
    namespaced: true,
    state: () => ({
        type: 'status',
        fetched: [],
        items: {}
    }),
    mutations: {
        ...baseMutations,
        addFetchType (state, type) {
            if (state.fetched.find(f => f.type == type)) {
                state.fetched = state.fetched.map(s => ({
                    ...s,
                    updatedAt: s.type == type ? new Date() : s.updatedAt
                }))
            } else {
                state.fetched = [ ...state.fetched, {
                    type, updatedAt: new Date()
                }]
            }
        }
    },
    actions: {
        async fetch ({ state, commit }, params = {}) {
            try {
                let response = null

                if (params.query.feed) {
                    response = await this.$axios.$post('/status/feed', {
                        ...params.query, options: params.options
                    }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })
                } else {
                    response = await this.$axios.$post('/entities/get', {
                        ...params.query, options: params.options, type: 'status',
                    }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })
                }

                if (!response) throw Error('no-response')
                
                if (params.softRefresh == true) {
                    commit('softRefresh', response.data)
                } else if (params.refresh !== false) {
                    commit('refresh', response.data)
                }

                if (params.type) commit('addFetchType', params.type)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async get ({ commit }, _id) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
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
            return await softFetch(items, { state, dispatch, commit })
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
                    } else if (typeof params[key] === 'object' &&
                    !Array.isArray(params[key]) &&
                    params[key] !== null) {
                        formData.append(key, JSON.stringify(params[key]))
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

                console.log('new status')
                console.log(response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
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
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    },
    getters: {
        isFetched: (state) => (type) => {
            return state.fetched.find(f => f.type == type)
        },
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

            return search ? searchItems(items, search, root.auth.user) : items
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

            let result = searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
        }
    }
}