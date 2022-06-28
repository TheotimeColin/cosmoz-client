<template>
    <div>
        <div class="Page_wrapper Wrapper">
            <h1 class="ft-title-s mb-20">
                Explorer les groupes
            </h1>

            <slider-block
                :slots="constellations.map(g => g._id)"
                class="outflow@xs"
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
    }
}
</script>

<style lang="scss" scoped>

</style>