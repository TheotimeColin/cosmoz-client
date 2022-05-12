<template>
    <div class="" v-if="profile">
        <app-banner :background="$bg.holo">
            <div class="fx-center width-100">
                <div class="fx-center fx-no-shrink">
                    <div @click="() => isSelf ? editSection = 'picture' : ''">
                        <user-icon
                            class="mr-20"
                            :no-link="isSelf"
                            :modifiers="['xl']"
                            v-bind="profile"
                        />
                    </div>

                    <div>
                        <p>{{ profile.name }}</p>
                        <div class="ft-s" v-if="profile.isAffinity">
                            Vous avez une affinité
                        </div>
                        <div class="ft-s" v-else-if="user.encounters.includes(profile._id)">
                            Vous vous êtes rencontré
                        </div>
                    </div>
                </div>

                <div class="ml-40 text-center fx-grow">
                    <div class="ft-s subtitle tape tape-strong m-3" v-for="(count, key) in profile.mentionsCategories" :key="key">
                        {{ $t('mentions.' + key) }} <span class="round round-s bg-bg ml-5">{{ count }}</span>
                    </div>
                </div>
            </div>
        </app-banner>

        <div class="Wrapper mv-60">
            
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
        this.target = await this.$store.dispatch('user/fetchOne', this.$route.params.id)
    },
    data: () => ({
        target: null,
        editSection: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        profile () { return this.$route.params.id == this.user._id ? this.user : this.target },
        isSelf () { return this.user._id == this.profile._id }
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>

</style>