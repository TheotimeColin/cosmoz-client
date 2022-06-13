<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
        <div v-if="Object.keys(gatheringsByDate).length > 0">
            <div class="Date" v-for="date in gatheringsByDate" :key="date.value">
                <p class="ft-title-xs">
                    {{ $moment(date.value).format('dddd D MMMM YYYY') }}
                </p>

                <block-gathering
                    v-for="gathering in date.items"
                    class="mt-20"
                    :status-only="true"
                    v-bind="gathering"
                    :key="gathering._id"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        this.$emit('page', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        this.$store.commit('page/set', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id, status: 'active' }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatheringsByDate () {
            return this.$store.getters['gathering/groupBy']('date', {
                constellation: this.constellation._id,
                status: 'active',
                isPast: false,
                sort: { date: 'desc' }
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