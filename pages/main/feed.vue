<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <div class="pt-20 br-s bg-bg-weak p-0@xs bg-bg@xs mb-20"
            v-if="attending.length > 0 || upcoming.length > 0">
            <p class="ft-title-xs mb-20 ph-20 p-0@xs">
                {{ attending.length > 0 ? `Mes prochaines sorties` : `Envie de sortir ?` }}
            </p>

            <slider-block :slots="(attending.length > 0 ? attending : upcoming).map(g => g._id)" item-class="width-2xs"
                class="outflow@xs" :ratio="130" :is-loading="isLoading" :offset="$smallerThan('xs') ? 15 : 20"
                :offset-v="20">
                <template v-for="(gathering, i) in attending.length > 0 ? attending : upcoming" :slot="gathering._id">
                    <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" :key="i" />
                </template>
            </slider-block>
        </div>

        <content-feed placeholder="Publier quelque chose..." />
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: 'onboarded',
    async fetch () {
        this.isLoading = true

        await this.$store.dispatch('gathering/softFetch', this.user.gatherings.map(g => g._id))

        this.isLoading = false
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        upcoming () {
            return this.$store.getters['gathering/find']({
                isPast: false,
                isFull: false,
                isAttending: false,
                status: 'active'
            }).slice(0, 6)
        },
        attending () {
            return this.$store.getters['gathering/find']({
                isPast: false,
                isAttending: true,
                status: 'active',
            })
        }
    }
}
</script>