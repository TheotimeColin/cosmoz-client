<template>
    <div class="">
        <div class="Wrapper Wrapper--s">
            <h1 class="ft-title-l mt-60">
                Mes événements passés
            </h1>

            <div class="pt-40 pb-60">
                <div v-for="gathering in gatherings" class="d-flex mb-60 d-block@s" :key="gathering._id">
                    <block-gathering
                        :modifiers="$smallerThan('s') ? [] : ['square']"
                        class="width-xs width-auto@s"
                        :status-only="true"
                        v-bind="gathering"
                    />
                    
                    <div class="fx-grow ph-20 ph-0@s">
                        <div class="p-15 bg-bg br-s">
                            <p class="ft-title-2xs mb-15">Rencontres :</p>

                            <div>
                                <user-icon class="mr-5 mb-5" v-for="user in gathering.users.filter(u => u.status == 'confirmed' && u._id != user._id).slice(0, 5)" :key="user._id" v-bind="user" />
                            </div>
                        </div>
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
                '$in': this.user.gatherings,
                date: { '$isBefore': this.$moment() },
                sort: { date: 'asc' }
            })
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
</style>