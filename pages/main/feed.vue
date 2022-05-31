<template>
    <div>
        <div class="Wrapper pv-60">
            <div class="d-flex d-block@s mt-60 mt-30@xs">
                <div class="fx-grow">
                    <div class="pt-20 br-s bg-bg-weak p-0@xs bg-bg-strong@xs">
                        <p class="ft-title-xs mb-20 ph-20 p-0@xs">
                            {{ attending.length > 0 ? `Mes prochaines sorties` : `Envie de sortir ?` }}
                        </p>
                        <slider-block
                            :slots="(attending.length > 0 ? attending : upcoming).map(g => g._id)"
                            item-class="width-2xs"
                            class="outflow@xs"
                            :ratio="100"
                            :is-loading="isLoading"
                            :offset="$smallerThan('xs') ? 15 : 20"
                            :offset-v="20"
                        >
                            <template v-for="(gathering, i) in attending.length > 0 ? attending : upcoming" :slot="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
                                    v-bind="gathering"
                                    :key="i"
                                />
                            </template>
                        </slider-block>
                    </div>

                    <div>
                        <p class="ft-title-s mt-40 mb-20 ft-title-xs@xs mt-20@xs">Mes actualités</p>
                        <content-feed
                            class="mb-60"
                            placeholder="Publier quelque chose..."
                        />
                    </div>
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