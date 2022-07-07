import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'notification',
        items: {}
    }),
    mutations: {
        ...baseMutations
    },
    actions: {
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'notification'
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async read ({ commit }, _id) {
            try {
                const response = await this.$axios.$get(getQuery('/notifications/read', { _id }))
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('refresh', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async readAll ({ commit }) {
            try {
                const response = await this.$axios.$get('/notifications/read')
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('refresh', response.data)
                
                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
    },
    getters: {
        items: (state) => {
            return Object.values(state.items)
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? searchItems(items, search, root.auth.user) : items
        }
    }
}