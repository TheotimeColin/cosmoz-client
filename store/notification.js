import storeUtils from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
    },
    actions: {
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities/get', { type: 'notification' }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async readAll ({ commit }) {
            try {
                const response = await this.$axios.$get('/notifications/read',)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                console.log(response.data)
                commit('refresh', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
    },
    getters: {
        items: (state) => {
            return Object.values(state.items)
        },
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? storeUtils.searchItems(items, search, root.auth.user) : items
        }
    }
}