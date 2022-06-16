export default {
    computed: {
        $constellation () {
            return this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            })
        },
    },
    methods: {
        $preFetch () {
            if (!this.$route.params.slug) return null
            
            return new Promise(async (resolve) => {
                resolve(await this.$store.dispatch('constellation/get', {
                    query: { slug: this.$route.params.slug }
                }))
            })
        }
    }
}