<template>
    <div>
        <div class="Wrapper Wrapper--s pv-40 ft-l">
            <h1 class="ft-title-l mb-30">On est partis !!</h1>
            <p>Hello</p>
            
            <div class="mt-60" v-for="(week, i) in gatheringsByWeek" :key="i">
                <p class="ft-title-m">
                    {{ getWeek(week.date) ? getWeek(week.date) : getDates(week.date) }} <span class="ft-m color-ft-weak">{{ getWeek(week.date) ? getDates(week.date) : `` }}</span>
                </p>

                <div class="row-xs mt-30">
                    <div class="col-6" v-for="gathering in week.gatherings" :key="gathering._id">
                        <block-gathering
                            v-bind="gathering"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class="p-relative bg-bg-xstrong">
            <div id="faq" class="anchor"></div>

            <div class="Wrapper Wrapper--s pv-40 ft-l">
                <h2 class="ft-title-m mb-30">Un doute, une question ?</h2>
                <faq />
            </div>
        </div>
        <div class="bg-cover bg-ice-cream">
            <div class="Wrapper Wrapper--s pv-40 ft-l text-center">
                <h3 class="ft-title-l mb-30">On a réussi à te convaincre de te lancer ?</h3>

                <div>
                    <button-base>Non, j'ai des questions</button-base>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeIndex',
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })
    },
    data: () => ({
    }),
    computed: {
        gatherings () {
            return this.$store.getters['gathering/find']({
                nextDate: '$notNull'
            })
        },
        gatheringsByWeek () {
            let weeks = {}

            this.gatherings.forEach(g => {
                g.dates.forEach(date => {
                    let id = this.$moment(date.date).format('yyyyww')

                    weeks[id] = weeks[id] ? { ...weeks[id], gatherings: [ ...weeks[id].gatherings, g ] } : { date: date.date, gatherings: [ g ] } 
                })
            })

            return weeks
        }
    },
    methods: {
        getWeek (week) {
            week = this.$moment(week)

            if (this.$moment().format('wwYYYY') == week.format('wwYYYY')) {
                return `Cette semaine`
            } else if (this.$moment().add(1, 'weeks').format('wwYYYY') == week.format('wwYYYY')) {
                return `Semaine prochaine`
            } else {
                return null
            }
        },
        getDates (week) {
            week = this.$moment(week)

            return `${week.startOf('week').format('D MMMM')} au ${week.endOf('week').format('D MMMM')}`
        }
    }
}
</script>

<style lang="scss" scoped>

</style>