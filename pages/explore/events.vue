<template>
    <div>
        <div class="Page_wrapper Wrapper">
            <h1 class="ft-title-s mb-20">
                Commencent bientôt
            </h1>

            <slider-block
                :slots="gatherings.map(g => g._id)"
                class="outflow@xs"
                :offset="$smallerThan('xs') ? 20 : 0"
                item-class="width-2xs"
            >
                <template v-for="gathering in gatherings" :slot="gathering._id">
                    <block-gathering
                        v-bind="gathering"
                        :modifiers="['square']"
                        :key="gathering._id"
                    />
                </template>
            </slider-block>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExploreIndex',
    layout: c => c.$auth.loggedIn ? 'app' : 'default',
    async fetch () {
        await this.$store.dispatch('constellation/fetch', {
            query: { type: 'community', featured: true },
            softRefresh: true
        })

        await this.$store.dispatch('gathering/fetch', {
            query: { status: 'active', visibility: 'public' }
        })

        this.isLoading = false
    },
    data: () => ({
        isLoading: true,
    }),
    computed: {
        user () { this.$store.getters['user/self'] },
        constellations () {
            return this.$store.getters['constellation/find']({
                type: 'community',
                featured: true
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                visibility: 'public',
                isPast: false,
                sort: { date: 'desc' }
            }).filter(g => this.constellations.find(c => c._id == g.constellation))
        },
    }
}
</script>

<style lang="scss" scoped>

</style>