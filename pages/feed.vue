<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <block-advice class="mv-20 shadow-s" v-if="!$store.state.auth.user.notifications.find(n => n.type == 'onboarding' && n.id == 'welcomed')" />

        <div class="block p-0 +mt-20 +mt-10@s" v-if="constellations.length > 0">
            <p class="ft-title-2xs ph-20 pt-20 d-none@xs">Mes constellations</p>

            <slider-block :slots="constellations.map(c => c._id)"  :offset="20" :offset-v="20" :margin="10" :paddingT="20">
                <div v-for="conste in constellations" :slot="conste._id" :key="conste._id">
                    <const-icon v-bind="conste" :modifiers="['l']" />
                </div>
            </slider-block>
        </div>

        <template v-if="!isLoading">
            <div class="block-f p-0 +mt-20 +mt-10@s" v-if="upcomingEvents.length > 0">
                <p class="ft-title-2xs p-20">Mes prochaines sorties</p>

                <slider-block :slots="upcomingEvents.map(g => g._id)" :ratio="130" item-class="width-2xs"
                    :offset="$smallerThan('xs') ? 15 : 20" :offset-v="20" :margin="10">
                    <div v-for="gathering in upcomingEvents" :slot="gathering._id" :key="gathering._id">
                        <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" />
                    </div>
                </slider-block>
            </div>

            <component
                v-for="status in endedGatherings"
                :is="status.type"
                class="+mt-20 +mt-10@s"
                v-bind="status"
                :key="status._id"
            />

            <div class="fx-center mv-40">
                <p class="ft-title-3xs fx-no-shrink mr-15 color-ft-xweak">Publications</p>
                <hr class="Separator">
            </div>

            <component
                :is="status.type"
                class="+mt-20 +mt-10@s"
                v-for="status in statuses"
                v-bind="status"
                :key="status._id"
            />
        </template>
        <template v-else>
            <placeholder class="+mt-20 +mt-10@s" :ratio="33" v-for="i in 10" :key="i" />
        </template>
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

        await this.$store.dispatch('gathering/softFetch', [
            ...this.user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').map(g => g._id)
        ])

        await this.$store.dispatch('user/softFetch', [
            ...this.upcomingEvents.reduce((t, g) => [ ...t, ...g.users.map(u => u._id)], []),
            ...this.endedGatherings.reduce((t, g) => [ ...t, ...g.users.map(u => u._id)], []),
            ...this.statuses.map(s => s.owner)
        ])

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
        upcomingEvents () {
            let gatherings = this.$store.getters['gathering/find']({
                status: 'active',
                isPast: false,
                isAttending: true
            })

            return gatherings
        },
        endedGatherings () {
            let gatherings = this.$store.getters['gathering/find']({
                status: 'active',
                isPast: true,
                isExpired: false,
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
                ...this.consteUpdates
            ].filter(s => s.createdAt)

            return statuses.sort((a, b) => {
                return this.$moment(b.createdAt).valueOf() - this.$moment(a.createdAt).valueOf()
            })
        },
        consteUpdates () {
            let result = this.$store.getters['status/find']({
                constellation: { $in: this.user.constellations },
                sort: { createdAt: 'asc' }
            })

            result = Object.entries(this.$groupBy(result, ['constellation']))

            result = result.map(r => {
                let posts = r[1].items.filter(s => s.content && s.images.length <= 0)
                let photos = r[1].items.filter(s => s.images.length > 0)
                
                return {
                    ...r[1].$groupData,
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