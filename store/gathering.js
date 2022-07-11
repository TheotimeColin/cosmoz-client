import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'gathering',
        items: {},
        queries: []
    }),
    mutations: {
        ...baseMutations,
        addQuery (state, query) {
            state.queries = [
                ...state.queries,
                { query, fetchedAt: new Date() }
            ]
        },
        removeQuery (state, query) {
            state.queries = state.queries.filter(q => JSON.stringify(q.query) != JSON.stringify(query))
        }
    },
    actions: { 
        async fetch ({ state, commit, getters }, params = {}) {
            try {
                let prevQuery = state.queries.find(q => JSON.stringify(q.query) == JSON.stringify(params.query))

                if (prevQuery && moment(prevQuery.fetchedAt).add(40, 'seconds') > moment()) {
                    return getters.items
                } else {
                    commit('removeQuery', params.query)
                }
                
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'gathering',
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)
                
                commit('addQuery', params.query)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async softFetch({ state, dispatch, commit }, items) {
            return await softFetch(items, { state, dispatch, commit })
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
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
                const response = await this.$axios.$post('/gathering/create', params)
                
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
                    params: { _id, type: 'gathering' }
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
        },
        async updateBookStatus ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/gathering/book', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                if (response.data.gathering) commit('updateOne', response.data.gathering)
                if (response.data.constellation) commit('constellation/updateOne', response.data.constellation, { root: true })
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    },
    getters: {
        items: (state, getters, root) => {
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
                    isAttending: root.auth.user && item.users.find(u => u._id == root.auth.user._id && (u.status == 'attending' || u.status == 'confirmed')) ? true : false,
                    isFull: item.max != 0 && item.users.filter(u => u.status == 'attending' || u.status == 'confirmed').length >= item.max,
                    isPast: item.date ? moment(item.date).isBefore(moment()) : false,
                    isExpired: item.date ? moment(item.date).add(4, 'days').isBefore(moment()) : false,
                    display: item.date ? moment(item.date).isBefore(moment()) : true,
                    hero
                }
            })
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? searchItems(items, search, root.auth.user) : items
        },
        groupBy: (state, getters) => (property, search, params) => {
            let items = search ? getters.find(search) : getters.items

            let result = []
            items = items.forEach(item => {
                let value = params.asDays ? moment(item[property]).format('YYYYMMDD') : item[property]

                if (result.find(i => i.value == value)) {
                    result = result.map(v => ({
                        ...v,
                        items: v.value == value ? [ ...v.items, item ] : v.items
                    }))
                } else {
                    result = [ ...result, { value, items: [ item ]} ]
                }

                // newObj[value] = { value: item[property], items: [ ...(newObj[value] ? newObj[value].items : []), item ] }

            })

            return result
        },
        findOne: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values({ ...state.items }) : getters.items

            let result = searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
        }
    }
}