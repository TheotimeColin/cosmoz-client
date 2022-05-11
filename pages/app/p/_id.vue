<template>
    <div class="" v-if="profile">
        <app-banner :background="$bg.holo">
            <div class="fx-center">
                <div @click="() => isSelf ? editSection = 'picture' : ''">
                    <user-icon
                        class="mr-20"
                        :no-link="isSelf"
                        :modifiers="['xl']"
                        v-bind="profile"
                    />
                </div>

                {{ profile.name }}
            </div>
        </app-banner>

        <div class="Wrapper mv-60">
            {{ profile.isAffinity ? 'A une affinité' : '' }}

            {{ user.encounters.includes(profile._id) ? 'A rencontré' : '' }}
            <button-base @click="createAffinity">Créer affinité</button-base>
        </div>

        <popin-base :is-active="editSection" @close="editSection = null" v-if="isSelf">
            <template slot="content">
                <div class="p-30">
                    <profile-edit :section="editSection" />
                </div>
            </template>
        </popin-base>
    </div>
</template>

<script>
export default {
    name: 'ProfilePage',
    layout: 'app',
    async fetch () {
        this.profile = await this.$store.dispatch('user/fetchOne', this.$route.params.id)
    },
    data: () => ({
        profile: null,
        editSection: null
    }),
    computed: {
        user () { return this.$store.state.auth.user },
        isSelf () { return this.user._id == this.profile._id }
    },
    methods: {
        async createAffinity () {
            
            await this.$store.dispatch('user/update', {
                affinities: [ ...this.user.affinities, this.profile._id ]
            })
        }
    }
}
</script>

<style lang="scss" scoped>

</style>