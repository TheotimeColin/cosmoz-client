<template>
    <div class="">
        <div class="Wrapper Wrapper--s">
            <h1 class="ft-title-l mt-100">
                Mes rencontres passés
            </h1>

            <div class="pt-40 pb-60">
                <div v-if="gatherings.length > 0">
                    <div v-for="gathering in gatherings" class="d-flex mb-20 d-block@s" :key="gathering._id">
                        <block-gathering
                            :modifiers="$smallerThan('s') ? [] : ['square']"
                            class="width-xs width-auto@s"
                            :status-only="true"
                            v-bind="gathering"
                        />
                        
                        <div class="fx-grow ph-20 ph-0@s">
                            <div class="p-15 bg-bg-weak br-s">
                                <p class="ft-title-2xs mb-15">Rencontres :</p>

                                <div>
                                    <user-icon class="mr-5 mb-5" v-for="user in gathering.users.filter(u => u.status == 'confirmed' && u._id != user._id).slice(0, 5)" :key="user._id" v-bind="user" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-bg-xstrong p-30 text-center br-s" v-else>
                    <fa icon="far fa-hand-wave" class="ft-xl color-ft-xweak line-1"></fa>

                    <p class="mt-10 mb-20 line-1">Tu n'as pas encore participé à un événement.</p>

                    <button-base :modifiers="['light']" :to="{ name: 'g' }">
                        Allez, je me lance !
                    </button-base>
                    
                    <div class="mt-5">
                        <link-base :to="{ name: 'faq' }">Des questions sur nos rencontres ?</link-base>
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
                _id: { $in: this.user.gatherings },
                isPast: true,
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