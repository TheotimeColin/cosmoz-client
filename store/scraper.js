import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'

export default {
    namespaced: true,
    actions: { 
        async scrape ({ commit }, url) {
            try {

                const response = await this.$axios.$get(getQuery('/scraper', { url }))

                return response.data
            } catch (e) {
                return handleErrors(e, commit, 'Erreur de scraping')
            }
        }
    }
}