<template>
    <div class="Gatherings page">
        <div class="Page_wrapper Wrapper Wrapper--xs">
            <template v-if="gatherings.length > 0">
                <div class="Date" v-for="gathering in gatherings" :key="gathering._id">
                    <placeholder class="Gatherings_item" :ratio="40" v-if="isLoading" />

                    <block-gathering
                        class="Gatherings_item" v-show="!isLoading"
                        v-bind="gathering"
                        :display-intro="true"
                    />
                </div>
            </template>
            <div class="bg-bg-strong p-30 text-center br-s" v-else>
                <fa icon="far fa-calendar-xmark" class="ft-xl color-ft-x$weak line-1"></fa>

                <p class="mt-10 mb-20 line-1">Tu n'as encore rien de prévu !</p>

                <button-base :modifiers="['light', 's']" icon-before="compass" :to="{ name: 'explore' }">
                    Trouver des sorties
                </button-base>
            </div>
        
            <div class="block-r mt-20" v-if="pastGatherings.length > 0">
                <h2 class="ft-title-xs mb-20">
                    Mes sorties passées
                </h2>

                <div class="+mt-10" v-for="gathering in pastGatherings" :key="gathering._id">
                    <template v-if="isLoading">
                        <placeholder class="+mt-10" :ratio="40" v-for="i in 2" :key="i" />
                    </template>

                    <block-gathering
                        v-bind="gathering"
                        :display-intro="true"
                        v-else
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: ['loggedUser'],
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('gathering/softFetch', [
            ...this.user.gatherings.map(g => g._id)
        ])

        this.isLoading = false
    },
    data: () => ({
        isLoading: true,
        format: 'YYYYDDD'
    }),
    computed: {
        gatherings () {
            return this.$store.getters['gathering/find']({
                date: '$notNull',
                status: 'active',
                isAttending: true,
                sort: { date: 'desc' },
                display: false
            })
        },
        constellations () {
            return this.$store.getters['constellation/find']({
            })
        },
        pastGatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                sort: { date: 'asc' },
                isPast: true,
                isAttending: true,
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.Date {

    & + & {
        margin-top: 20px;
    }
}
</style>