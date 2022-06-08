<template>
    <div class="Wrapper Wrapper--xs Page_wrapper">
        <nav-body :items="navItems" />
    </div>
</template>

<script>
export default {
    props: {
        constellation: { type: Object }
    },
    data: () => ({

    }),
    computed: {
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'page-admin',
                    label: 'Personnalisation',
                    props: { constellation: this.constellation }
                }, {
                    id: 'roles',
                    component: 'page-admin-roles',
                    label: 'Rôles',
                    props: { constellation: this.constellation }
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