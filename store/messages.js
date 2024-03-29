import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'messages',
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: {
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'channelMessage',
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.softRefresh) {
                    commit('softRefresh', response.data)
                } else if (params.refresh !== false) {
                    commit('refresh', response.data)
                }

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
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

                const response = await this.$axios.$post('/messages/post', formData, { headers: {
                    'Content-Type': 'multipart/undefined'
                }})
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data.message)
                if (response.data.channel) commit('channel/updateOne', response.data.channel, { root: true })
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'channelMessage' }
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
        items: (state) => {
            return Object.values(state.items)
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