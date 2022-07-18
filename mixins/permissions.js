export default {
    computed: {
        $isUser () { return this.user ? true : false },
        $constellation () {
            if (this.$route.params.slug) {
                return this.$store.getters['constellation/findOne']({
                    slug: this.$route.params.slug
                })
            } else {
                let conste = this.constellation || this.gathering?.constellation
            
                return this.$store.getters['constellation/findOne']({
                    _id: conste
                })
            }
        },
        $gathering () {
            let gId = this.$route.params.eventId || this.$route.query.eventId
            
            return gId ? this.$store.getters['gathering/findOne']({
                id: gId,
                status: 'active'
            }) : null
        },
        $isConsteFollower () {
            if (!this.$constellation || !this.user) return false

            return this.$constellation.followers.includes(this.user._id)
        },
        $isConsteMember () {
            if (!this.$constellation || !this.user) return false

            return this.$constellation.members.includes(this.user._id)
        },
        $isConsteOrga () {
            if (!this.user) return false

            if (this.user.role == 'admin' || this.$gathering && this.$gathering.owner == this.user._id) {
                return true
            }

            if (this.$constellation) {
                return [ ...this.$constellation.organizers, ...this.$constellation.admins ].includes(this.user._id)
            }

            return false
        },
        $isConsteAdmin () {
            if (!this.$constellation || !this.user) return false

            return this.user.role == 'admin' || this.$constellation.admins.includes(this.user._id)
        }
    },
    methods: {

    }
}