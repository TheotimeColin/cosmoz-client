export default {
    transition (to, from) {
        if (to.name.includes('postId')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    async fetch () {
        await this.$store.dispatch('status/get', this.$route.params.postId)
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        status () {
            return this.$store.getters['status/findOne']({
                _id: this.$route.params.postId
            })
        }
    },
    methods: {
        async onSubmit (formData) {
            this.isSubmitLoading = true

            try {
                let data = { ...formData }

                if (this.gathering) {
                    data.gathering = this.gathering
                    data.read = 'public'
                }

                if (this.constellation) {
                    data.constellation = this.constellation
                }

                const response = await this.$store.dispatch('status/create', data)

                if (response.status == 0) {
                    this.errors = [ response.error ]
                    throw Error(response.error)
                }

                if (this.$refs.post) this.$refs.post.reset()
            } catch (e) {
                console.error(e)
            }

            this.isSubmitLoading = false
        }
    }
}