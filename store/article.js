import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'

import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')
import CONSTANTS from '@/utils/constants'

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: { 
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    ...params.query, type: 'article',
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
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    ...params.query, type: 'article'
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
                    ...params, type: 'article'
                })
                
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
                    params: { _id, type: 'article' }
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
            return Object.values(state.items).map(item => {
                let thumbnail = ''
                let hero = ''

                if (item.cover) {
                    if (item.cover.medias.find(m => m.size == 's')) thumbnail = item.cover.medias.find(m => m.size == 's').src
                    
                    if (item.cover.medias.find(m => m.size == 'm')) hero = item.cover.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item,
                    thumbnail, hero,
                    createdAt: moment(item.createdAt),
                    updatedAt: moment(item.updatedAt)
                }
            })
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            
            if (search) {
                Object.keys(search).forEach(key => {
                    items = items.filter(item => item[key] == search[key])
                })
            }

            return items.sort((a, b) => a.createdAt && b.createdAt ? b.createdAt.valueOf() - a.createdAt.valueOf() : false)
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