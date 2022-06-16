<template>
    <div class="Gatherings page">
        <div class="Page_wrapper Wrapper Wrapper--xs">
            <template v-if="gatheringsByDate.length > 0">
                <div class="Date" v-for="date in gatheringsByDate" :key="date.value">
                    <p class="ft-title-xs mb-20">{{ $date(date.value) }}</p>

                    <template v-if="isLoading">
                        <placeholder class="Gatherings_item" :ratio="40" v-for="i in 2" :key="i" />
                    </template>

                    <div class="Gatherings_item" v-for="gathering in date.items" :key="gathering._id" v-show="!isLoading">
                        <block-gathering
                            v-bind="gathering"
                            :display-intro="true"
                        />
                    </div>
                </div>
            </template>
            <div class="bg-bg-strong p-30 text-center br-s" v-else>
                <fa icon="far fa-calendar-xmark" class="ft-xl color-ft-x$weak line-1"></fa>

                <p class="mt-10 mb-20 line-1">Tu n'as encore rien de prévu !</p>

                <button-base :modifiers="['light', 's']" icon-before="compass" :to="{ name: 'explore' }">
                    Trouver des sorties
                </button-base>
            </div>
        
            <div class="block-r mt-30" v-if="pastGatherings.length > 0">
                <h2 class="ft-title-xs mb-20">
                    Mes sorties passées
                </h2>

                <div class="Gatherings_item" v-for="gathering in pastGatherings" :key="gathering._id">
                    <template v-if="isLoading">
                        <placeholder class="Gatherings_item" :ratio="40" v-for="i in 2" :key="i" />
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
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { status: 'active' }
        })

        await this.$store.dispatch('constellation/fetch', {
            query: {}
        })

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
                display: false
            })
        },
        constellations () {
            return this.$store.getters['constellation/find']({
            })
        },
        gatheringsByDate () {
            return this.$store.getters['gathering/groupBy']('date', {
                status: 'active',
                sort: { date: 'desc' },
                isPast: false,
                isAttending: true,
            }, { asDays: true })
        },
        pastGatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                sort: { date: 'asc' },
                isPast: true,
                isAttending: true,
            })
        }
    },
    head () {
        let meta = {
            title: `Les rencontres ${this.$t('meta.append')}`
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>

.Gatherings_item {

    & + & {
        margin-top: 15px;
    }
}

.Date {

    & + & {
        margin-top: 30px;
    }
}
</style>