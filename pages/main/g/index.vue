<template>
    <div class="Gatherings">
        <div class="Wrapper">
            <h1 class="ft-title-l mt-100">
                Envie de sortir ?
            </h1>

            <div class="d-flex mt-40">
                <div class="fx-grow">
                    <div class="mb-60 mb-30@xs" v-for="(date, i) in gatheringsByDate" :key="i">
                        <p class="ft-title-xs mb-20">{{ $date(date.date) }}</p>

                        <template v-if="isLoading">
                            <placeholder class="Gatherings_item" :ratio="40" v-for="i in 2" :key="i" />
                        </template>

                        <div class="Gatherings_item" v-for="gathering in date.gatherings" :key="gathering._id" v-show="!isLoading">
                            <block-gathering
                                v-bind="gathering"
                                :display-intro="true"
                            />
                        </div>
                    </div>
                </div>
                <div class="width-s fx-no-shrink ml-40 d-none@s">
                    <p class="ft-title-xs mb-20">
                        Groupes à suivre
                    </p>

                    <block-orga
                        v-for="orga in organizations"
                        class="mb-20"
                        v-bind="orga"
                        :key="orga._id"
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
            query: {}
        })

        await this.$store.dispatch('organization/fetch', {
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
                display: false
            })
        },
        organizations () {
            return this.$store.getters['organization/find']({
            })
        },
        gatheringsByDate () {
            let weeks = {}

            this.gatherings.forEach(g => {
                let id = this.$moment(g.date).format(this.format)

                weeks[id] = weeks[id] ? { ...weeks[id], gatherings: [ ...weeks[id].gatherings, g ] } : { date: g.date, gatherings: [ g ] } 
            })

            return weeks
        },
    },
    head () {
        let meta = {
            title: `Les événements ${this.$t('meta.append')}`
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
</style>