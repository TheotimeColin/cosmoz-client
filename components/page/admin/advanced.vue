<template>
    <div>
        <div class="block-r +mt-10">
            <p class="ft-title-xs mb-20">
                Type de constellation
            </p>

            <button-base type="button" class="+mt-5" :modifiers="['rect']" icon-before="hand-wave" :icon-after="constellation.type == 'group' ? 'check' : ''" subtitle="Les groupes sont plus personnels. Ils sont parfaits pour des personnes qui se connaissent déjà !" @click="onSwitch('group')">
                Groupe
            </button-base>

            <button-base type="button" class="+mt-5" :modifiers="['rect']" icon-before="face-sunglasses" :icon-after="constellation.type == 'community' ? 'check' : ''" subtitle="Les communautés sont destinées à grandir : elles organisent des événements pour accueillir de nouveaux membres." @click="onSwitch('community')">
                Communauté
            </button-base>
        </div>

        <div class="block-r +mt-10">
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
        
    },
    methods: {
        async onSwitch (type) {
            if (this.constellation.type == type) return

            this.$store.commit('page/popin', { confirm: {
                text: `Veux-tu vraiment changer le type de constellation ?`,
                subtitle: `Il n'est pas recommandé de modifier le type de ta constellation trop souvent.`,
                cancel: {
                    text: 'Annuler'
                },
                confirm: {
                    text: 'Confirmer',
                    modifiers: ['cosmoz'],
                    action: () => {
                        this.$store.dispatch('constellation/create', {
                            _id: this.constellation._id, params: { type }
                        })
                    }
                }
            } })
        },
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