import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: { 
        async fetch ({ commit }, params) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    ...params.query,
                    type: 'mediaCollection'
                }))

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
                    _id, type: 'mediaCollection'
                }))
                
                commit('updateOne', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params) {
            return new Promise(async (resolve, reject) => {
                try {
                    let formData = new FormData()
                    formData.append('type', 'mediaCollection')
                    formData.append('params', JSON.stringify({
                        title: params.file.name,
                        path: params.path ? params.path : null,
                        size: params.size ? params.size : null
                    }))

                    formData.append('file', params.file)
                    
                    const response = await this.$axios.$post('/entities', formData, { headers: {
                        'Content-Type': 'application/json'
                    } })
                    if (response.status == 0) throw Error(response.errors[0])
                    
                    resolve(response.data)
                } catch (e) {
                    console.warn(e)
                    resolve(null)
                }
            })
        },
        async createDirect ({ commit }, params) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await this.$axios.$post('/entities', {
                        ...params, type: 'mediaCollection'
                    })

                    if (response.status == 0) throw Error(response.errors[0])
                    
                    resolve(response.data)
                } catch (e) {
                    console.warn(e)
                    resolve(null)
                }
            })
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'mediaCollection' }
                })
                
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
            return Object.values(state.items).map(item => ({
                ...item,
                createdDate: moment(item.createdDate),
                sizes: item.medias.reduce((prev, current) => {
                    return { ...prev, [current.size]: current }
                }, {})
            }))
        },
        find: (state, getters) => search => {
            return getters.items
        },
        findOne: (state, getters) => search => {
            return getters.items[0]
        }
    }
}