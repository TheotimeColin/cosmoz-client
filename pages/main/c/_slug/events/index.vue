<template>
    <div class="Wrapper pv-40">
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
        this.$emit('page', {
            subtitle: `Rencontres prévues`, fa: 'calendar'
        })

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id, status: 'active' }
        })
    },
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.$store.getters['gathering/find']({
                constellation: { '$id': this.constellation._id },
                status: 'active',
                isPast: false
            })
        }
    },
    head () {
        let meta = {
            title: `Rencontres prévues ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>