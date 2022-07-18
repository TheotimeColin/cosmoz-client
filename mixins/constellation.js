export default {
    computed: {
        $constellation () {
            return this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            })
        },
        $gatherings () {
            if (!this.$constellation) return []

            return this.$store.getters['gathering/find']({
                status: 'active',
                constellation: this.$constellation._id
            })
        }
    },
    methods: {
        $preFetch (force = false) {
            if (!this.$route.params.slug) return null
            
            return new Promise(async (resolve) => {
                let result = this.$store.getters['constellation/findOne']({
                    slug: this.$route.params.slug
                })
        
                if (!result || force) {
                    result = await this.$store.dispatch('constellation/get', {
                        query: { slug: this.$route.params.slug }
                    })

                    await this.$store.dispatch('user/softFetch', [
                        ...result.members,
                        ...result.organizers,
                        ...result.followers,
                        ...result.admins
                    ])
                }

                resolve(result)
            })
        }
    }
}