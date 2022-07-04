<template>
    <div>
        <div class="block-r +mt-20" v-if="formData.followers.length > 0">
            <p class="ft-title-xs mb-20">
                <span class="round-s mr-5 bg-bg">{{ formData.followers.length }}</span> Demandes d'entrée
            </p>

            <div class="bg-bg-xweak p-10 br-xs fx-center +mt-5" v-for="user in formData.followers" :key="user">
                <user-icon
                    v-bind="$getUser(user)"
                    :no-link="true"
                    :display-name="true"
                    :modifiers="['m']"
                />

                <div>
                    <button-base :modifiers="['xs', 'round', 'weak']" icon-before="check" @click="() => acceptUser(user)" :loading="usersLoading.includes(user)" />
                </div>
            </div>
        </div>

        <div class="block-r +mt-20">
            <input-user :items="formData.members.map(m => $getUser(m))" />
        </div>

        <div class="block +mt-20">
            <page-admin-invite-links :constellation="constellation" />
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
        await this.$store.dispatch('user/softFetch', this.constellation.members)
    },
    data: () => ({
        entityType: 'constellation',
        inputs: ['members', 'followers'],
        usersLoading: [],
        isLoading: false
    }),
    computed: {
        defaultFormData () {
            return {
                members: [],
                followers: [],
            }
        },
    },
    methods: {
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