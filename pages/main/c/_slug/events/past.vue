<template>
    <div class="Page_wrapper Wrapper Wrapper--xs">
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
        this.$store.commit('page/set', {
            subtitle: `Sorties passées`, fa: 'calendar'
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
                constellation: this.constellation._id,
                status: 'active',
                isPast: true
            })
        }
    },
    head () {
        let meta = {
            title: `Sorties passées ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>