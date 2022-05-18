<template>
    <div class="Gatherings">
        <div class="Wrapper">
            <h1 class="ft-title-l pt-60">
                Envie de sortir ?
            </h1>

            <div class="d-flex mt-40">
                <div class="fx-grow">
                    <div class="d-flex mb-60 mb-30@xs" v-for="(date, i) in gatheringsByDate" :key="i">
                        <div class="width-3xs d-none@xs">
                            <tile-date class="p-sticky" style="--offset: 20px" :date="date.date" />
                        </div>

                        <div class="ml-10 fx-grow ml-0@xs">
                            <p class="ft-title-2xs mb-20 d-none d-block@xs">{{ $date(date.date) }}</p>

                            <div class="Gatherings_item" v-for="gathering in date.gatherings" :key="gathering._id">
                                <block-gathering
                                    v-bind="gathering"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="width-s fx-no-shrink ml-20 d-none@s">
                    <div class="p-20 bg-bg"></div>
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
    },
    data: () => ({
        format: 'YYYYDDD'
    }),
    computed: {
        gatherings () {
            return this.$store.getters['gathering/find']({
                date: '$notNull',
                display: false
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
    methods: {
        
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