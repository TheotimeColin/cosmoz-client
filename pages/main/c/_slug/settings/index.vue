<template>
    <div class="Wrapper pv-40">
        
    </div>
</template>

<script>
export default {
    async fetch () {

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
            subtitle: `Paramètres`, fa: 'cog'
        })

        let meta = {
            title: `Paramètres ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>

.Section {

    & + & {
        margin-top: 40px;
    }
}
</style>