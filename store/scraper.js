import storeUtils from '@/utils/store'

export default {
    namespaced: true,
    actions: { 
        async scrape ({ commit }, url) {
            try {

                const response = await this.$axios.$get(storeUtils.getQuery('/scraper', { url }))

                return response.data
            } catch (e) {
                return storeUtils.handleErrors(e, commit, 'Erreur de scraping')
            }
        }
    }
}