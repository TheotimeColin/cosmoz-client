<template>
    <div>
        <div class="Wrapper">
            <div class="d-flex mt-40 d-block@s mt-0@s">
                <div class="fx-grow o-hidden">
                    <div class="pv-20 br-s bg-bg" v-if="attending.length > 0">
                        <p class="ft-title-xs mb-20 ph-20">Mes prochaines sorties</p>

                        <slider-block
                            item-class="width-2xs"
                            :offset="20"
                        >
                            <div v-for="gathering in attending" :slot="gathering._id" :key="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
                                    v-bind="gathering"
                                />
                            </div>
                        </slider-block>
                    </div>
                    <div class="pv-20 br-s bg-bg" v-else-if="upcoming.length > 0">
                        <p class="ft-title-xs mb-20 ph-20">Envie de sortir ?</p>

                        <slider-block
                            item-class="width-2xs"
                            :offset="20"
                        >
                            <template v-for="gathering in upcoming" :slot="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    v-bind="gathering"
                                    :key="gathering._id"
                                />
                            </template>
                        </slider-block>
                    </div>

                    <p class="ft-title-s mt-40 mb-20">Mes actualités</p>
                    <content-feed
                        class="mb-60"
                        :disable-create="true"
                    />
                </div>
                <div class="width-xs fx-no-shrink ml-20 d-none@s">
                    <div class="p-20 bg-bg"></div>
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
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                '$in': this.user.booked
            })
        },
        upcoming () {
            return this.$store.getters['gathering/find']({
                date: { '$isAfter': this.$moment() },
                isFull: false
            }).slice(0, 6)
        },
        attending () {
            return this.$store.getters['gathering/find']({
                date: { '$isAfter': this.$moment() },
                '$in': this.user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed')
            })
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
</style>