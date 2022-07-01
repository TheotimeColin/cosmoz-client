import storeUtils from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        type: 'reaction',
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
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
                    ...params.query, type: 'reaction',
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
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/reaction/create', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)

                if (response.data.reaction) commit('updateOne', response.data.reaction)
                if (response.data.status) commit('status/updateOne', response.data.status, { root: true })
                if (response.data.origin) commit('status/updateOne', response.data.origin, { root: true })
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$delete('/reaction', {
                    params
                })

                if (response.status == 0) throw Error(response.errors[0])
                
                if (response.data.status) commit('status/updateOne', response.data.status, { root: true })
                if (response.data.origin) commit('status/updateOne', response.data.origin, { root: true })

                if (response.data.reaction) commit('deleteOne', response.data.reaction._id)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
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