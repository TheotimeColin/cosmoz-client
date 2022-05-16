<template>
    <div class="pb-40">
        <div class="Wrapper Wrapper--s pb-60 pt-40">
            <p class="ft-title-m mb-30">Mes affinités</p>

            <div class="row-xs">
                <div class="col-2 mb-10" v-for="user in affinities" :key="user._id">
                    <user-profile v-bind="user" />
                </div>
            </div>

            <div class="mt-40 p-20 bg-bg br-s">
                <p class="ft-title-m mb-10">Rencontres</p>
                <div class="row-xs">
                    <div class="col-3 mt-10" v-for="user in encounters" :key="user._id">
                        <user-icon :display-name="true" v-bind="user" />
                    </div>
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
        encounters () {
            return this.$store.getters['user/find']({
                isEncountered: true,
                _id: '$notSelf'
            }).filter(u => !this.affinities.find(b => b._id == u._id))
        },
        affinities () {
            return this.$store.getters['user/find']({
                isAffinity: true,
                _id: '$notSelf'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>