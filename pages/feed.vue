<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <block-advice class="mv-20 shadow-s" v-if="!$store.state.auth.user.notifications.find(n => n.type == 'onboarding' && n.id == 'welcomed')" />

        <component
            :is="status.type"
            class="+mt-20 +mt-10@s"
            v-for="status in statuses"
            v-bind="status"
            :key="status._id"
        />
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: ['loggedUser'],
    layout: 'app',
    async fetch () {
        this.isLoading = true

        await this.$store.dispatch('status/fetch', {
            type: 'feed', query: {}, softRefresh: true
        })

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        selectedUser: null
    }),
    mounted () {
        this.$store.dispatch('user/updateNotification', { id: 'home-menu', type: 'onboarding' })
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        constellations () {
            return this.$store.getters['constellation/find']({
                _id: { $in: this.user.constellations }
            })
        },
        endedGatherings () {
            let gatherings = this.$store.getters['gathering/find']({
                status: 'active',
                isPast: true,
                isAttending: true
            }).slice(0, 3)

            gatherings = gatherings.map(g => {
                return {
                    ...g,
                    type: 'content-gathering-end',
                    createdAt: this.$moment(g.date).add(2, 'hours').toDate()
                }
            })

            return gatherings
        },
        weekGatherings () {
            let gatherings = this.$store.getters['gathering/find']({
                status: 'active',
                isPast: false,
                date: { $lte: this.$moment().add(10, 'days').toDate() },
                constellation: { $in: this.user.constellations }
            })

            gatherings = Object.entries(this.$groupBy(gatherings, ['constellation', { date: '$week' }]))

            gatherings = gatherings.map(r => {
                return {
                    _id: 'gatherings-' + r[0],
                    constellation: this.$store.getters['constellation/findOne']({ _id: r[1].$groupData.constellation }),
                    gatherings: r[1].items.sort((a, b) => {
                        return this.$moment(b.date).valueOf() - this.$moment(a.date).valueOf()
                    }),
                    type: 'content-conste-gatherings',
                    createdAt: this.$moment(r[1].items[0].date).subtract(2, 'days').toDate()
                }
            })

            return gatherings
        },
        statuses () {
            let statuses = []

            statuses = [
                ...this.consteUpdates,
                ...this.weekGatherings,
                ...this.endedGatherings,
            ].filter(s => s.createdAt)

            return statuses.sort((a, b) => {
                return this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()
            })
        },
        consteUpdates () {
            let result = this.$store.getters['status/find']({
                constellation: { $in: this.user.constellations }
            })

            result = Object.entries(this.$groupBy(result, ['constellation', { createdAt: '$days5' }]))

            result = result.map(r => {
                let posts = r[1].items.filter(s => s.content && s.images.length <= 0)
                let photos = r[1].items.filter(s => s.images.length > 0)
                
                return {
                    _id: 'posts-' + r[0],
                    constellation: this.$store.getters['constellation/findOne']({ _id: r[1].$groupData.constellation }),
                    statuses: { photos, posts },
                    type: 'content-conste-update',
                    createdAt: r[1].items[0].createdAt
                }
            })

            return result
        }
    },
}
</script>