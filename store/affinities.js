import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    state: () => ({

    }),
    mutations: {

    },
    actions: {
        async sendMentions ({ rootState, commit }, params) {
            try {
                const response = await this.$axios.$post('/affinities/send-mentions', {
                    ...params
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                this.$auth.fetchUser()

                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    }
}