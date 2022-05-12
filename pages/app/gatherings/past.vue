<template>
    <div class="">
        <app-banner :background="$bg.iceCream">
            Inscriptions
        </app-banner>
        <div class="Wrapper">
            <div class="d-flex mt-30">
                <div class="fx-grow">
                    <div v-for="gathering in gatherings" class="mb-10" :key="gathering._id">
                        <block-gathering
                            v-bind="gathering"
                        />
                        <div class="p-20 b">
                            <p class="mb-10">Rencontres</p>

                            <div>
                                <user-icon class="mr-5 mb-5" v-for="user in gathering.users.filter(u => u.status == 'confirmed' && u._id != user._id)" :key="user._id" v-bind="user" />
                            </div>
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
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                '$in': this.user.attended
            })
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
</style>