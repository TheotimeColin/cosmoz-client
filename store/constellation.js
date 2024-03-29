import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'constellation',
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: { 
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'constellation'
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.softRefresh) {
                    commit('softRefresh', response.data)
                } else if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetchFeed ({ state, commit }, _id) {
            try {
                const response = await this.$axios.$post('/constellation/feed', { _id })

                commit('status/softRefresh', response.data, { root: true })

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async softFetch ({ state, dispatch, commit }, items) {
            return await softFetch(items, { state, dispatch, commit })
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    ...params.query, type: 'constellation'
                }))

                let result = Array.isArray(response.data) ? response.data[0] : response.data
   
                commit('updateOne', result)
                return result
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async createInvite ({ commit }, id) {
            try {
                const response = await this.$axios.$post('/constellation/invite-link', { id })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response.data
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async deleteInvite ({ commit }, id) {
            try {
                const response = await this.$axios.$delete('/constellation/invite-link', { params: { id } })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response.data
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async apply ({ commit }, id) {
            try {
                const response = await this.$axios.$post('/constellation/apply', { id })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async accept ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/constellation/enter', params)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async leave ({ commit }, id) {
            try {
                const response = await this.$axios.$post('/constellation/leave', { id })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params, type: 'constellation'
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async createNew ({ commit }, params = {}) {
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
                
                const response = await this.$axios.$post('/constellation/create', formData, { headers: {
                    'Content-Type': 'multipart/undefined'
                } })
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'constellation' }
                })

                commit('utils/addFlash', {
                    type: response.status == 1 ? 'success' : 'error'
                }, { root: true })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                await this.$auth.fetchUser()
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
                let thumbnail, hero, logoSmall, logoLarge = ''

                if (item.cover) {
                    if (item.cover.medias.find(m => m.size == 's')) thumbnail = item.cover.medias.find(m => m.size == 's').src
                    
                    if (item.cover.medias.find(m => m.size == 'm')) hero = item.cover.medias.find(m => m.size == 'm').src
                }

                if (item.logo) {
                    if (item.logo.medias.find(m => m.size == 's')) logoSmall = item.logo.medias.find(m => m.size == 's').src
                    
                    if (item.logo.medias.find(m => m.size == 'm')) logoLarge = item.logo.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item, thumbnail, hero, logoSmall, logoLarge,
                    isMember: root.auth.user && item.members.includes(root.auth.user._id) ? true : false,
                    isFollower: root.auth.user && item.followers.includes(root.auth.user._id) ? true : false
                }
            })
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? searchItems(items, search, root.auth.user) : items
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}