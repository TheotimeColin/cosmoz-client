import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'channel',
        current: null,
        currentWriting: false,
        isWriting: [],
        items: {}
    }),
    mutations: {
        ...baseMutations,
        
        setCurrent (state, _id) {
            state.current = _id
        },
        setWriting (state, params) {
            if (params.action && !state.isWriting.find(r => r.user == params.value.user && r.channel == params.value.channel)) {
                state.isWriting = [ ...state.isWriting, params.value ]
            } else if (params.action === false) {
                state.isWriting = state.isWriting.filter(r => r.user != params.value.user && r.channel != params.value.channel)
            }
        },
        setCurrentWriting (state, action) {
            state.currentWriting = action
        }
    },
    actions: {
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'channel',
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
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    _id, type: 'channel'
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
        async update ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params, type: 'channel'
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/messages/create-channel', params)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data.channel)
                
                if (response.data.message) commit('messages/updateOne', response.data.message, { root: true })
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'channel' }
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
        items: (state, getters, root) => {
            return Object.values(state.items).map(item => {

                return {
                    ...item,
                    unread: root.auth.user && !item.readBy.includes(root.auth.user._id),
                    lastUpdate: item.lastMessage ? item.lastMessage.createdAt : null
                }
            })
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? searchItems(items, search, root.auth.user) : items
        },
        findOne: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values({ ...state.items }) : getters.items

            let result = searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
        }
    }
}