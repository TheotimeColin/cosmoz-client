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
        async create ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/affinities/send-mentions', {
                    ...params
                })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                if (response.data.mention) commit('updateOne', response.data.mention)
                
                this.$auth.fetchUser()

                return response
            } catch (e) {
                return handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(getQuery('/entities/get', {
                    ...params.query, type: 'mention',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        }
    },
    getters: {
        items: (state) => {
            return Object.values(state.items).reduce((total, item) => {
                item.types.forEach(type => {
                    total = [ ...total, { type, ...item } ]
                })

                return total
            }, [])
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? searchItems(items, search, root.auth.user) : items
        }
    }
}