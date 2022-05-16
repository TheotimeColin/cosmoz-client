<template>
    <div class="Profile" v-if="profile">
        <app-banner :background="$bg.holo">
            <div class="fx-center width-100">
                <div class="fx-center fx-no-shrink">
                    <div class="p-relative mr-20" @click="() => isSelf ? editSection = 'picture' : ''">
                        <user-icon
                            :no-link="isSelf"
                            :modifiers="['xl']"
                            v-bind="profile"
                        />

                        <div class="Profile_pictureOverlay" v-if="isSelf">
                            <fa icon="far fa-camera" />
                        </div>
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
                    <div class="ft-title-3xs tape tape-strong m-3" v-for="(count, key) in profile.mentionsCategories" :key="key">
                        {{ $t('mentions.' + key) }} <span class="round round-s bg-bg ml-5">{{ count }}</span>
                    </div>
                </div>
            </div>
        </app-banner>

        <div class="Wrapper Wrapper--xs mv-60">
            <tidbit
                :type="TYPE"
                class="Profile_tidbit"
                :editable="isSelf"
                v-for="TYPE in TIDBITS"
                v-bind="getTidbit(TYPE)"
                :key="TYPE"

                v-show="getTidbit(TYPE).value || isSelf"
            />
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
const TIDBITS = ['socials', 'anything']

export default {
    name: 'ProfilePage',
    layout: 'app',
    async fetch () {
        this.target = await this.$store.dispatch('user/fetchOne', this.$route.params.id)
    },
    data: () => ({
        TIDBITS,
        target: null,
        editSection: null
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        profile () { return this.$route.params.id == this.user.id ? this.user : this.target },
        isSelf () { return this.profile && this.user.id == this.profile.id }
    },
    mounted () {
        console.log(this.profile)
    },
    methods: {
        getTidbit (type) {
            let result = this.profile.tidbits && this.profile.tidbits.find(t => t.type == type)
            return result ? result : {}
        }
    }
}
</script>

<style lang="scss" scoped>
    .Profile_tidbit {

        & + & {
            margin-top: 20px;
        }
    }

    .Profile_pictureOverlay {
        font-size: 20px;
        border-radius: 50%;
        @include absolute-fill;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0.5;
        transition: all 100ms ease;
        cursor: pointer;
        
        &:hover {
            opacity: 1;
        }
    }
</style>