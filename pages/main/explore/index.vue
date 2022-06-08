<template>
    <div class="Gatherings page">
        <div class="Page_wrapper Wrapper">
            <h1 class="ft-title-l">
                Explorer les groupes
            </h1>

            <div class="row-s mt-20">
                <div class="col-4 col-6@s" v-for="constel in constellations" :key="constel._id">
                    <block-const
                        class="mb-10"
                        style="height: 100%"
                        v-bind="constel"
                    />
                </div>
            </div>
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