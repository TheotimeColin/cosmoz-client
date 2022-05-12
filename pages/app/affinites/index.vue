<template>
    <div class="">
        <app-banner :background="$bg.night">
            Mes affinités
        </app-banner>

        <div class="Wrapper">
            <div class="d-flex mt-30">
                <div class="fx-grow">
                    <div class="row-xs">
                        <div class="col-3 mt-10" v-for="user in affinities" :key="user._id">
                            <user-profile v-bind="user" />
                        </div>
                    </div>
                </div>
                <div class="width-s fx-no-shrink ml-20">
                    <div class="p-20 bg-bg-strong"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GatheringsPast',
    middleware: 'onboarded',
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('user/fetch', {
            query: {}
        })
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        affinities () { return this.$store.getters['user/find']({
            isAffinity: true,
            _id: '$notSelf'
        }) }
    }
}
</script>

<style lang="scss" scoped>
</style>