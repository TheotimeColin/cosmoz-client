<template>
    <div>
        <div class="block mt-20">
            <link-base @click="onDelete">
                Supprimer cette constellation
            </link-base>
        </div>
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
        user () { return this.$store.getters['user/self'] },
    },
    methods: {
        async onDelete () {
            this.$store.commit('page/popin', { confirm: {
                text: `Veux-tu vraiment supprimer ${this.constellation.name} ?`,
                subtitle: 'Cette action est définitive : les publications et les événements liés seront également supprimés.',
                cancel: {
                    text: 'Annuler'
                },
                confirm: {
                    text: 'Confirmer la suppression',
                    modifiers: ['error'],
                    action: () => {
                        this.$router.push(this.localePath({ name: 'feed' }))
                        this.$store.dispatch('constellation/delete', this.constellation._id)
                    }
                }
            } })
        }
    },
}
</script>

<style lang="scss" scoped>
</style>