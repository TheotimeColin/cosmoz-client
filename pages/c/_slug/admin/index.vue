<template>
    <div v-if="this.$constellation">
        <div class="Wrapper Wrapper--xs Page_wrapper">
            <nav-body :items="navItems" />
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
    },
    computed: {
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'page-admin-members',
                    label: 'Membres',
                    props: { constellation: this.$constellation }
                }, {
                    id: 'customization',
                    component: 'page-admin',
                    label: 'Personnalisation',
                    props: { constellation: this.$constellation }
                }, {
                    id: 'roles',
                    component: 'page-admin-roles',
                    label: 'Rôles',
                    props: { constellation: this.$constellation }
                }
            ]
        },
        user () { return this.$store.getters['user/self'] },
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: `Administration`
        })

        this.$emit('page', {            
            subtitle: `Administration`, fa: 'crown'
        })

        let meta = {
            title: `Administration ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>
</style>