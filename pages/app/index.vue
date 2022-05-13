<template>
    <div class="">
        <app-banner :background="$bg.iceCream">
            Salut {{ user.name }}
        </app-banner>
        <div class="Wrapper">
            <div class="d-flex mt-30">
                <div class="fx-grow o-hidden">
                    <div class="p-20 br-s bg-bg-strong">
                        <p class="ft-title-xs mb-20">Mes prochaines sorties</p>

                        <slider-block
                            item-class="width-2xs"
                        >
                            <template v-for="gathering in attending" :slot="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
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
                <div class="width-xs fx-no-shrink ml-20">
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
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                '$in': user.booked
            })
        },
        attending () {
            return this.$store.getters['gathering/find']({
                '$in': this.user.gatherings.filter(g => g.status == 'attending')
            })
        }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
</style>