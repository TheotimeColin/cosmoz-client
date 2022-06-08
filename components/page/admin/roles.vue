<template>
    <form @submit.prevent="onSubmit">
        <div class="block mt-20">
            <div class="mb-30">
                <p class="ft-title-xs mb-15">Administration</p>

                <div class="fx-center p-10 br-xs bg-bg-strong mr-5 mb-5" v-for="user in formData.admins" :key="user">
                    <user-icon :modifiers="['s']" :display-name="true" v-bind="getUser(user)" />

                    <div>
                        <button-base type="button" icon-before="times" :modifiers="['xs', 'round', 'xweak']" @click="removeUser(user, 'admins')" v-if="formData.admins.length > 1" />
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
                        <button-base type="button" icon-before="crown" :modifiers="['xs', 'round', 'xweak']" @click="addAdmin(user)" />

                        <button-base type="button" icon-before="times" :modifiers="['xs', 'round', 'xweak']" @click="removeUser(user, 'organizers')" />
                    </div>
                </div>
            </div>
            
            <input-user @input="addUser" :items="serverEntity.members.map(m => getUser(m))" :exclude="[...formData.organizers, ...formData.admins ]" />
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
        inputs: ['admins', 'organizers'],
        defaultFormData: {
            organizers: [],
            admins: [],
        }
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
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