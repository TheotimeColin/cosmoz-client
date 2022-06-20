<template>
    <div v-if="$constellation">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <nav-bar class="mb-20" v-model="type" :items="[
                { id: 'index', label: 'À venir' },
                { id: 'past', label: 'Passés' },
            ]" />

            <div v-if="Object.keys(gatheringsByDate).length > 0">
                <div class="Date" v-for="date in gatheringsByDate" :key="date.value">
                    <p class="ft-title-xs mb-20">
                        {{ $moment(date.value).format('dddd D MMMM YYYY') }}
                    </p>

                    <block-gathering
                        v-for="gathering in date.items"
                        class="+mt-10"
                        :status-only="true"
                        v-bind="gathering"
                        :key="gathering._id"
                    />
                </div>
            </div>
            <div class="block-r text-center bg-bg-strong" v-else>
                Pas encore d'événements ici.
            </div>
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch () {
        await this.$preFetch()

        this.$emit('page', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        this.$store.commit('page/set', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.$constellation._id, status: 'active' }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false,
        type: 'index'
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatheringsByDate () {
            return this.$store.getters['gathering/groupBy']('date', {
                constellation: this.$constellation._id,
                status: 'active',
                isPast: this.type == 'past',
                sort: { date: this.type == 'past' ? 'asc' : 'desc' }
            }, { asDays: true })
        }
    },
    head () {
        let meta = {
            title: `Rencontres prévues ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>
.Date {

    & + & {
        margin-top: 60px;
    }
}
</style>