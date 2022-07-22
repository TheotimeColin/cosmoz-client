<template>
    <div class="Page_wrapper Wrapper">
        <h1 class="ft-title-s mb-20">
            Explorer les groupes
        </h1>

        
        <div class="outflow@xs p-0">
            <slider-block
                :slots="constellations.map(g => g._id)"
                :offset="$smallerThan('xs') ? 20 : 0"
                item-class="width-s"
            >
                <template v-for="conste in constellations" :slot="conste._id">
                    <block-const
                        style="height: 100%"
                        v-bind="conste"
                        :key="conste._id"
                    />
                </template>
            </slider-block>
        </div>

        <h1 class="ft-title-s mb-20 mt-30">
            Commencent bientôt
        </h1>

        <div class="outflow@xs p-0">
            <slider-block
                :slots="gatherings.map(g => g._id)"
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
            query: { status: 'active', visibility: 'public' },
            softRefresh: true
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
                type: 'official',
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