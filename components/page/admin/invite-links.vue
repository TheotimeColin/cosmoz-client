<template>
    <div>
        <div class="fx-center mb-10">
            <p class="ft-title-xs">
                Liens d'invitation
            </p>

            <button-base :modifiers="['xs']" @click="createInviteLink" :loading="isLoading" :disabled="inviteTokens && inviteTokens.filter(t => t.id).length >= 5" icon-before="plus">
                Créer un nouveau lien
            </button-base>
        </div>

        <div class="mb-20">Les personnes qui utilisent ce lien deviennent directement membre de cette constellation, <b>sans vérification</b>.</div>

        <div class="+mt-5 bg-bg p-10 pl-15 br-xs fx-center bg-bg-weak@xs" v-for="token in inviteTokens.filter(t => t.id)" :key="token.id">
            <p class="ellipsis-1" style="user-select: all">{{ getInviteLink(token.id) }}</p>

            <div class="fx-no-shrink ml-10">
                <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="copy" @click="() => $copy(getInviteLink(token.id))" />
                
                <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="times" @click="() => deleteInviteLink(token._id)" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        constellation: { type: Object }
    },
    async fetch () {
        this.inviteTokens = await this.$store.dispatch('token/fetch', {
            query: {
                constellation: this.constellation._id,
                type: 'invite'
            }
        })
    },
    data: () => ({
        inviteTokens: [],
        isLoading: false
    }),
    methods: {
        getInviteLink (token) {
            return this.$config.baseUrl + this.localePath({ name: 'invite-token', params: { token }})
        },
        async createInviteLink () {
            this.isLoading = true
            
            const response = await this.$store.dispatch('constellation/createInvite', this.constellation._id)

            if (response.token) this.inviteTokens = [ ...this.inviteTokens, { _id: response.token._id, id: response.token.id } ]
            
            this.isLoading = false
        },
        async deleteInviteLink (id) {
            this.$store.commit('page/popin', { confirm: {
                text: `Veux-tu vraiment supprimer ce lien d'invitation ?`,
                subtitle: `Toutes les personnes qui cliqueront sur ce lien ne pourront plus rejoindre cette constellation.`,
                cancel: {
                    text: 'Annuler'
                },
                confirm: {
                    text: 'Supprimer',
                    modifiers: ['error'],
                    action: async () => {
                        this.isLoading = true
            
                        const response = await this.$store.dispatch('constellation/deleteInvite', id)

                        this.inviteTokens = this.inviteTokens.filter(t => t._id != id)
                        
                        this.isLoading = false
                    }
                }
            } })

            
        }
    },
}
</script>

<style lang="scss" scoped>
</style>