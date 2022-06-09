<template>
    <div>
        <div class="block mb-20" v-if="formData.followers.length > 0">
            <p class="ft-title-xs mb-15">
                <span class="round-s mr-5 bg-bg">{{ formData.followers.length }}</span> Demandes d'entrée
            </p>

            <div class="bg-bg-xweak p-10 br-xs fx-center" v-for="user in formData.followers" :key="user">
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

        <div class="block">
            <input-user @input="addUser" :items="formData.members.map(m => getUser(m))" />
        </div>

        <div class="block mt-20">
            <div class="fx-center mb-15">
                <p class="ft-title-xs">
                    Liens d'invitation
                </p>

                <button-base :modifiers="['xs']">
                    Créer un nouveau lien
                </button-base>
            </div>

            <div class="bg-bg p-10 pl-15 br-xs fx-center">
                <p style="user-select: all">{{ inviteLink }}</p>

                <div>
                    <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="copy" @click="() => $copy(inviteLink)" />
                    
                    <button-base :modifiers="['2xs', 'round', 'weak']" icon-before="times" @click="() => acceptUser(user)" />
                </div>
            </div>
        </div>

        <!-- <form-errors class="mt-20" :items="errors" />

        <div class="text-right mt-20">
            <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
        </div> -->
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
    },
    data: () => ({
        entityType: 'constellation',
        inputs: ['members', 'followers'],
        usersLoading: [],
        defaultFormData: {
            members: [],
            followers: [],
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        inviteLink () {
            return this.$config.baseUrl + this.localePath({ name: 't-token', params: { token: this.constellation.slug }})
        }
    },
    methods: {
        getUser (_id) {
            return this.$store.getters['user/findOne']({ _id })
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