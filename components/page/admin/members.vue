<template>
    <div>
        <div class="block +mt-20" v-if="formData.followers.length > 0">
            <p class="ft-title-xs mb-20">
                <span class="round-s mr-5 bg-bg">{{ formData.followers.length }}</span> Demandes d'entrée
            </p>

            <div class="bg-bg-xweak p-10 br-xs fx-center +mt-5" v-for="user in formData.followers" :key="user">
                <user-icon
                    v-bind="getUser(user)"
                    :no-link="true"
                    :display-name="true"
                    :modifiers="['m']"
                />

                <div>
                    <button-base :modifiers="['xs', 'round', 'weak']" icon-before="check" @click="() => acceptUser(user)" :loading="usersLoading.includes(user)" />
                </div>
            </div>
        </div>

        <div class="block +mt-20">
            <input-user :items="formData.members.map(m => getUser(m))" />
        </div>

        <div class="block +mt-20">
            <div class="fx-center mb-10">
                <p class="ft-title-xs">
                    Liens d'invitation
                </p>

                <button-base :modifiers="['xs']" @click="createInviteLink" :loading="isLoading" :disabled="inviteTokens.filter(t => t.id).length >= 5">
                    Créer un nouveau lien
                </button-base>
            </div>

            <p class="mb-20">Les personnes qui utilisent ce lien deviennent directement membre de ton groupe, <b>sans vérification</b>.
            
            <br><br>On te conseille de le diffuser à nombre limité de personnes, qui font déjà partie de la communauté.</p>

            <div class="+mt-5 bg-bg p-10 pl-15 br-xs fx-center bg-bg-weak@xs" v-for="token in inviteTokens.filter(t => t.id)" :key="token.id">
                <p class="ellipsis-1" style="user-select: all">{{ getInviteLink(token.id) }}</p>

                <div class="fx-no-shrink ml-10">
                    <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="copy" @click="() => $copy(getInviteLink(token.id))" />
                    
                    <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="times" @click="() => acceptUser(user)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import EntityEditor from '@/mixins/entity-editor'

export default {
    mixins: [ EntityEditor ],
    props: {
        constellation: { type: Object }
    },
    async fetch () {
        await this.fetchEntity(this.constellation._id)
        
        this.inviteTokens = await this.$store.dispatch('token/fetch', {
            type: 'invite'
        })

        await this.$store.dispatch('user/softFetch', this.constellation.members)
    },
    data: () => ({
        entityType: 'constellation',
        inputs: ['members', 'followers'],
        usersLoading: [],
        inviteTokens: [],
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        defaultFormData () {
            return {
                members: [],
                followers: [],
            }
        },
    },
    methods: {
        getInviteLink (token) {
            return this.$config.baseUrl + this.localePath({ name: 'invite-token', params: { token }})
        },
        getUser (_id) {
            return this.$store.getters['user/findOne']({ _id })
        },
        async createInviteLink () {
            this.isLoading = true
            
            const response = await this.$store.dispatch('constellation/createInvite', this.constellation._id)

            if (response.token) this.inviteTokens = [ ...this.inviteTokens, { id: response.token } ]
            
            this.isLoading = false
        },
        async acceptUser (_id) {
            this.usersLoading = [ ...this.usersLoading, _id ]

            await this.$store.dispatch('constellation/accept', {
                conste: this.constellation._id,
                user: _id
            })
            
            this.usersLoading = this.usersLoading.filter(u => u != _id)
        }
    },
}
</script>

<style lang="scss" scoped>
</style>