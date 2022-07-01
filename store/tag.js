import storeUtils from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'tag',
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        softRefresh (state, values) {
            state.items = storeUtils.softRefresh(state, values)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
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
            return await storeUtils.softFetch(items, { state, dispatch, commit })
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
            return search ? storeUtils.searchItems(items, search, root.auth.user) : items
        },
        findOne: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values({ ...state.items }) : getters.items

            let result = storeUtils.searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
        }
    }
}