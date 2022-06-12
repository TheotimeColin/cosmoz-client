export default {
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        constellation () {
            return this.$store.getters['constellation/findOne']({
                _id: this.gathering.constellation
            })
        },
        attending () {
            return this.$shuffle(this.usersByStatus(['attending', 'confirmed'])).slice(0, 2).map(u => u.name).join(', ')
        },
        hasBooked () {
            return this.user && this.usersByStatus(['attending']).find(u => u._id == this.user._id)
        },
        isWaiting () {
            return this.user && this.usersByStatus(['waiting']).find(u => u._id == this.user._id)
        },
        hasWaitingList () {
            return this.usersByStatus(['attending', 'confirmed']).length >= this.gathering.max
        },
        hasConfirmed () {
            return this.user && this.usersByStatus(['confirmed']).find(u => u._id == this.user._id) ? true : false
        },
        canonical () {
            return this.$config.baseUrl + this.localePath({ name: 'c-slug-events-eventId', params: { id: this.gathering.id, slug: this.constellation.slug }})
        },
        googleCal () {
            return `http://www.google.com/calendar/event?action=TEMPLATE&sprop=name:${this.gathering.title}&sprop=website:${this.canonical}&text=${this.gathering.title}&details=${this.gathering.intro}+${this.canonical}&dates=${this.$moment.utc(this.gathering.date).format('YYYYMMDDTHHmmss[Z]')}%2F${this.$moment.utc(this.gathering.date).add(2, 'hours').format('YYYYMMDDTHHmmss[Z]')}`
        }
    },
    methods: {
        usersByStatus (statuses) {
            let users = Object.values(this.gathering.users.reduce((all, current) => ({
                ...all, [current._id]: current 
            }), {}))

            return users.filter(u => statuses.includes(u.status))
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