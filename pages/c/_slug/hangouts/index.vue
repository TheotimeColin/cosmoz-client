<template>
    <div class="page" v-if="$constellation">
        <div class="Wrapper pv-40">
            Pas encore de sorties prévues
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch () {
        await this.$preFetch()

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.$constellation._id }
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
        let meta = {
            title: `Sorties prévues ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>