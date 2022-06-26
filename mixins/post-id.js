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
        
        if (this.$route.params.replyId) {
            await this.$store.dispatch('status/get', this.$route.params.replyId)
        }

        if (this.onLoaded) this.onLoaded()
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        status () {
            return this.$store.getters['status/findOne']({
                _id: this.$route.params.replyId ? this.$route.params.replyId : this.$route.params.postId
            })
        },
        originPost () {
            if (this.$route.params.replyId) {
                return this.$store.getters['status/findOne']({
                    _id: this.$route.params.postId
                }) 
            }
        },
        originConste () {
            if (this.originPost.constellation) {
                return this.$store.getters['constellation/findOne']({
                    _id: this.originPost.constellation
                }) 
            }
        },
        originLink () {
            if (this.originConste) {
                return {
                    name: 'c-slug-post-postId',
                    params: { slug: this.originConste.slug, postId: this.originPost._id }
                }
            } else {
                return {
                    name: 'post-postId',
                    params: { postId: this.originPost._id }
                }
            }
        },
        originOwner () {
            return this.$store.getters['user/findOne']({
                _id: this.originPost.owner
            })
        },
        originTitle () {
            return this.originPost.content ? this.originPost.content : `Publication de ${this.originOwner?.name}`
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