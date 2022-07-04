import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'tag',
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: { 
        async fetch ({ state, commit, getters }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'tag',
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                commit('softRefresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async softFetch({ state, dispatch, commit }, items) {
            return await softFetch(items, { state, dispatch, commit })
        }
    },
    getters: {
        items: (state, getters, root) => {
            return Object.values(state.items).map(item => {
                
                return {
                    ...item
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