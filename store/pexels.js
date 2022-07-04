import { baseMutations, getQuery, updateOne, deleteOne, softRefresh, refresh, softFetch, handleErrors, searchItems } from '@/utils/store'
import axios from 'axios'

export default {
    namespaced: true,
    actions: { 
        async fetch ({ commit }, params = { orientation: 'landscape' }) {

            try {
                if (!params.query) params.query = {}

                let url = params.query.query ? 'https://api.pexels.com/v1/search' : 'https://api.pexels.com/v1/curated'
                if (!params.query.per_page) params.query.per_page = 15
                if (!params.query.locale) params.query.locale = 'fr-FR'

                const response = await axios.get(getQuery(url, {
                    ...params.query,
                    orientation: 'landscape'
                }), { headers: { Authorization: this.$config.PEXELS }})

                if (!response.data?.photos) throw Error('pexels-error')

                return response.data.photos
            } catch (e) {
                return handleErrors(e, commit, 'Erreur de connexion à Pexels')
            }
        }
    }
}