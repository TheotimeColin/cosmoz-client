<template>
    <div>
        <div class="Wrapper pv-60">
            <div class="d-flex d-block@s mt-60">
                <div class="fx-grow o-hidden">
                    <placeholder :ratio="33" class="bg-bg-strong" v-if="isLoading" />
                    <div class="pv-20 br-s bg-bg" v-else>
                        <p class="ft-title-xs mb-20 ph-20">
                            {{ attending.length > 0 ? `Mes prochaines sorties` : `Envie de sortir` }}
                        </p>

                        <slider-block
                            item-class="width-2xs"
                            :offset="20"
                        >
                            <template v-for="(gathering, i) in attending.length > 0 ? attending : upcoming" :slot="i">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
                                    v-bind="gathering"
                                    :key="i"
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
    async fetch () {
        this.isLoading = true

        await this.$store.dispatch('gathering/fetch', {
            query: {}
        })

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
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
                isPast: false,
                isFull: false
            }).slice(0, 6)
        },
        attending () {
            return this.$store.getters['gathering/find']({
                isPast: false,
                _id: { $in: this.user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed') }
            })
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
</style>