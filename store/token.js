import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    actions: {
        async fetch ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities/get', {
                    ...params.query, type: 'token',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                return response.data
            } catch (e) {
                console.error(e)
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async get ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/token/get', params)
                return response.data
            } catch (e) {
                console.error(e)
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    }
}