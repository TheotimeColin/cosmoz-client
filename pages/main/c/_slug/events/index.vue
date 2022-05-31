<template>
    <div class="Wrapper p-40">
        <div v-if="gatherings.length > 0">
            <block-gathering
                v-for="gathering in gatherings"
                class="mb-20"
                :status-only="true"
                v-bind="gathering"
                :key="gathering._id"
            />
        </div>
    </div>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('gathering/fetch', {
            query: { organization: this.orga._id }
        })
    },
    props: {
        orga: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                organization: { '$id': this.orga._id },
                isPast: false
            })
        }
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        let meta = {
            title: `Rencontres prévues ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>