export default {
    computed: {
        $isUser () { return this.user ? true : false },
        $constellation () {
            return this.$route.params.slug ? this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            }) : null
        },
        $gathering () {
            return this.$route.params.eventId ? this.$store.getters['gathering/findOne']({
                id: this.$route.params.eventId,
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
            if (!this.$constellation || !this.user) return false

            return this.user.role == 'admin' || [ ...this.$constellation.organizers, ...this.$constellation.admins ].includes(this.user._id)
        },
        $isConsteAdmin () {
            if (!this.$constellation || !this.user) return false

            return this.user.role == 'admin' || this.$constellation.admins.includes(this.user._id)
        }
    },
    methods: {

    }
}