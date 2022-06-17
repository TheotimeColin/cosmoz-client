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

            <!-- <div class="row-s mt-20">
                <div class="col-4 col-6@s col-12@xs mb-10" v-for="constel in constellations" :key="constel._id">
                    <block-const
                        style="height: 100%"
                        v-bind="constel"
                    />
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'ExploreIndex',
    async fetch () {
        this.$store.commit('page/set', { isOpenNav: true })

        await this.$store.dispatch('constellation/fetch', {
            query: {}
        })

        this.isLoading = false
    },
    beforeDestroy () {
        this.$store.commit('page/set', { isOpenNav: false })
    },
    data: () => ({
        isLoading: true,
    }),
    computed: {
        constellations () {
            return this.$store.getters['constellation/find']({
                isMember: false
            })
        },
    },
    head () {
        let meta = {
            title: `Explorer les groupes ${this.$t('meta.append')}`
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>

</style>