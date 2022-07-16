<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <block-advice class="mb-20 shadow-s" v-if="!$store.state.auth.user.notifications.find(n => n.type == 'onboarding' && n.id == 'welcomed')" />

        <template v-if="!isLoading">
            <div class="+mt-20 +mt-10@s outflow@xs p-0" v-if="constellations.length > 0">
                <slider-block :slots="constellations.map(c => c._id)" :offset="$smallerThan('xs') ? 20 : 0" :offset-v="0" :margin="10">
                    <div v-for="conste in constellations" :slot="conste._id" :key="conste._id">
                        <const-icon v-bind="conste" :modifiers="['l']" />
                    </div>
                </slider-block>
            </div>

            <div class="+mt-20 block-f p-0 +mt-10@s" v-if="upcomingEvents.length">
                <div class="ph-20 pt-20">
                    <h2 class="ft-title-xs">
                        <span class="round-s bg-bg-xstrong mr-5">{{ upcomingEvents.length }}</span> Mes événements à venir
                    </h2>
                </div>

                <div class="pt-20">
                    <slider-block :slots="upcomingEvents.map(e => e._id)" :ratio="130" item-class="width-2xs" :offset="20" :offset-v="20" :margin="10" v-if="upcomingEvents.length > 0">
                        <div v-for="gathering in upcomingEvents" :slot="gathering._id" :key="gathering._id">
                            <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" />
                        </div>
                    </slider-block>
                </div>
            </div>

            <content-feed
                class="+mt-20 +mt-10@s"
                :hide-editor="true"
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
        await this.$store.dispatch('gathering/softFetch', [
            ...this.user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').map(g => g._id)
        ])

        await this.$store.dispatch('user/softFetch', [
            ...this.upcomingEvents.reduce((t, g) => [ ...t, ...g.users.map(u => u._id)], [])
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
    }
}
</script>