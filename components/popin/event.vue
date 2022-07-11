<template>
    <popin :is-active="eventId ? true : false" :modifiers="['s']" @close="onClose">
        <template slot="content" slot-scope="{ isPopinVisible }">
            <div v-show="!isPopinVisible">
                <placeholder :ratio="35" />

                <div class="p-20">
                    <placeholder class="+mt-10" :ratio="5" />
                    <placeholder class="+mt-10" :ratio="12" />
                    <placeholder class="+mt-10" :ratio="25" />
                    <placeholder class="+mt-10" :ratio="15" />
                </div>
            </div>
            <div v-show="isPopinVisible">
                <div class="ratio-35 bg-bg-strong"></div>

                <div class="p-0" v-if="gathering">
                    <page-gathering-manage
                        :gathering="gathering"
                        isMin
                    />
                </div>
            </div>
        </template>
    </popin>
</template>

<script>

export default {
    name: 'EventPopin',
    data: () => ({
        isLoading: true
    }),
    computed: {
        eventId () {
            return this.$store.state.page.popins.event
        },
        gathering () {
            if (!this.eventId) return null

            return this.$store.getters['gathering/findOne']({ id: this.eventId })
        }
    },
    watch: {
        ['$route.query.eventId']: {
            immediate: true,
            handler (v) {
                if (v && v != this.eventId) {
                    this.$store.commit('page/popin', { event: v })
                } else if (!v && this.eventId) {
                    this.$store.commit('page/popin', { event: null })
                }
            }
        },
        eventId (v) {
            if (v) {
                this.$router.push({ query: { ...this.$route.query, ['eventId']: v } })
            } else {
                this.$router.replace({ query: { ...this.$route.query, ['eventId']: undefined } })
            }
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { event: null })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>