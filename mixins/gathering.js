export default {
    data: () => ({
        isLoading: false
    }),
    computed: {
        constellation () {
            return this.$route.params.slug ? this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            }) : null
        },
        attending () {
            return this.$shuffle(this.usersByStatus(['attending', 'confirmed'])).slice(0, 2).map(u => u.name).join(', ')
        },
        hasBooked () {
            return this.user && this.usersByStatus(['attending', 'confirmed']).find(u => u._id == this.user._id)
        },
        isWaiting () {
            return this.user && this.usersByStatus(['waiting']).find(u => u._id == this.user._id)
        },
        hasWaitingList () {
            return this.gathering.max && this.usersByStatus(['attending', 'confirmed']).length >= this.gathering.max
        },
        roomLeft () {
            return Math.max(this.gathering.max - this.usersByStatus(['attending', 'confirmed']).length, 0) 
        },
        hasConfirmed () {
            return this.user && this.usersByStatus(['confirmed', 'attending']).find(u => u._id == this.user._id) ? true : false
        },
        canonical () {
            if (!this.constellation) return ''

            return this.$config.baseUrl + this.localePath({ name: 'c-slug-events-eventId', params: { id: this.gathering.id, slug: this.constellation.slug }})
        },
        googleCal () {
            return `http://www.google.com/calendar/event?action=TEMPLATE&sprop=name:${this.gathering.title}&sprop=website:${this.canonical}&text=${this.gathering.title}&details=${this.canonical}+${this.canonical}&dates=${this.$moment.utc(this.gathering.date).format('YYYYMMDDTHHmmss[Z]')}%2F${this.$moment.utc(this.gathering.date).add(2, 'hours').format('YYYYMMDDTHHmmss[Z]')}`
        }
    },
    methods: {
        usersByStatus (statuses = ['attending', 'confirmed', 'cancelled', 'ghosted']) {
            let users = Object.values(this.gathering.users.reduce((all, current) => ({
                ...all, [current._id]: current 
            }), {}))

            return users.filter(u => statuses.includes(u.status)).map(u => this.$getUser(u._id)).filter(u => u).sort((a, b) => (a.picture ? 0 : 999) - (b.picture ? 0 : 999))
        },
        async onBookManage (status) {
            this.isLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: [ status ]
                })
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        async onBookUpdate (status) {
            this.isLoading = true

            try {
                await this.$store.dispatch('gathering/updateBookStatus', {
                    _id: this.gathering._id,
                    users: [
                        { _id: this.user._id, status: status }
                    ]
                })
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}