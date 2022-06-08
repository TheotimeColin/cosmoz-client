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