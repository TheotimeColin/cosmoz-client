<template>
    <popin :is-active="eventId ? true : false" :modifiers="[]" @close="onClose">
        <template slot="content" v-if="!isLoading">
            <div class="ratio-25 bg-bg-strong"></div>

            <div class="p-0" v-if="gathering">
                <div class="ft-title-m pt-30 ph-20">
                    {{ gathering.title }}
                </div>

                <page-gathering-manage
                    :gathering="gathering"
                    isMin
                />
            </div>
        </template>
        <template slot="content" v-else>
            <placeholder :ratio="25" />

            <div class="p-20">
                <placeholder class="+mt-10" :ratio="5" />
                <placeholder class="+mt-10" :ratio="12" />
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
        },
        gathering (v) {
            if (v) {
                setTimeout(() => this.isLoading = false, 1000)
            } else {
                this.isLoading = true
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