<template>
    <div class="Wrapper pv-40">
        Pas encore de sorties prévues
    </div>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Sorties prévues`, fa: 'calendar'
        })

        let meta = {
            title: `Sorties prévues ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>