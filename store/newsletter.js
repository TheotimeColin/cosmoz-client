export default {
    namespaced: true,
    state: () => ({

    }),
    actions: {
        async subscribe ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/user/subscribe', params)
                
                if (response.status == 0) throw Error(response.errors[0])
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
    }
}