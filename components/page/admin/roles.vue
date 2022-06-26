<template>
    <form @submit.prevent="onSubmit">
        <div class="block mt-20">
            <div class="mb-30">
                <p class="ft-title-xs mb-15">Administration</p>

                <div class="+mt-5 fx-center block-r bg-bg p-10" v-for="user in formData.admins" :key="user">
                    <user-icon :modifiers="['s']" :display-name="true" v-bind="getUser(user)" />

                    <div>
                        <quick-menu :items="[
                            { label: `Retirer de l'équipe`, disabled: formData.admins.length <= 1, fa: 'times', action: () => removeUser(user, 'admins') }
                        ]" :button="{ modifiers: ['2xs', 'xweak'] }" />
                    </div>
                </div>
            </div>

            <div class="mb-30">
                <p class="ft-title-xs mb-15">Organisation</p>

                <div class="p-10 br-xs bg-bg text-center color-ft-xweak" v-if="formData.organizers.length <= 0">
                    Pas d'organisateurs.
                </div>

                <div class="fx-center p-10 br-xs bg-bg-strong mr-5 mb-5" v-for="user in formData.organizers" :key="user" v-else>
                    <user-icon :modifiers="['s']" :display-name="true" v-bind="getUser(user)" />

                    <div>
                        <quick-menu :items="[
                            { label: 'Nommer administrateur', fa: 'crown', action: () => addAdmin(user) },
                            { label: `Retirer de l'équipe`, fa: 'times', action: () => removeUser(user, 'organizers') }
                        ]" :button="{ modifiers: ['xs', 'xweak'] }" />
                    </div>
                </div>
            </div>
            
            <input-user
                :actions="[
                    { label: 'Nommer administrateur', fa: 'crown', action: (v) => addAdmin(v) },
                    { label: 'Nommer organisateur', fa: 'star', action: (v) => addUser(v) },
                ]"
                :items="serverEntity.members.map(m => getUser(m))"
                :exclude="[...formData.organizers, ...formData.admins ]"
            />
        </div>

        <form-errors class="mt-20" :items="errors" />

        <div class="text-right mt-20">
            <button-base type="submit" :modifiers="['light']">Sauvegarder</button-base>
        </div>
    </form>
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
        inputs: ['admins', 'organizers']
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        defaultFormData () {
            return {
                organizers: [],
                admins: [],
            }
        },
    },
    methods: {
        addAdmin (_id) {
            this.formData.admins = [ ...this.formData.admins, _id ]
            this.removeUser(_id, 'organizers')
        },
        removeUser (_id, type) {
            this.formData = {
                ...this.formData,
                [type]: this.formData[type].filter(u => u !== _id)
            }
        },
        getUser (_id) {
            return this.$store.getters['user/findOne']({ _id })
        },
        addUser (v) {
            this.formData.organizers = [ ...this.formData.organizers, v ]
        }
    },
}
</script>

<style lang="scss" scoped>
</style>