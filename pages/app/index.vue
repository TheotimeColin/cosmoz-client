<template>
    <div class="">
        <app-banner :background="$bg.iceCream">
            Envie de sortir ?
        </app-banner>
        <div class="Wrapper">
            <p class="ft-title-l mt-30">Commencent bientôt</p>

            <div class="d-flex mt-30">
                <div class="fx-grow">
                    <div class="d-flex mb-60" v-for="(date, i) in gatheringsByDate" :key="i">
                        <div class="width-3xs">
                            <tile-date class="p-sticky" style="--offset: 20px" :date="date.date" />
                        </div>

                        <div class="ml-10 fx-grow">
                            <div v-for="gathering in date.gatherings" class="mb-10" :key="gathering._id">
                                <block-gathering
                                    v-bind="gathering"
                                />
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
    name: 'DashboardIndex',
    middleware: 'onboarded',
    layout: 'app',
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
</style>