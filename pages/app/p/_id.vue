<template>
    <div class="Profile" v-if="profile">
        <app-banner :background="$bg.holo">
            <div class="fx-center width-100 d-block@xs">
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
                    <div class="fx-grow">
                        <p>{{ profile.name }}</p>
                        <div class="ft-s" v-if="profile.isAffinity">
                            Vous avez une affinité
                        </div>
                        <div class="ft-s" v-else-if="user.encounters.includes(profile._id)">
                            Vous vous êtes rencontré
                        </div>
                    </div>
                </div>

                <div class="ml-40 text-center fx-grow ml-0@xs mt-20@xs text-left@xs">
                    <div class="ft-title-3xs tape tape-strong m-3" v-for="(count, key) in profile.mentionsCategories" :key="key">
                        {{ $t('mentions.' + key) }} <span class="round round-s bg-bg ml-5">{{ count }}</span>
                    </div>
                </div>
            </div>
        </app-banner>

        <div class="Wrapper mv-60 mv-40@xs">
            <div class="row-s">
                <div class="col-7">
                    <div v-if="tidbits.length > 0">
                        <tidbit
                            :type="TYPE"
                            class="Profile_tidbit"
                            :editable="isSelf"
                            v-for="TYPE in tidbits"
                            v-bind="getTidbit(TYPE)"
                            :key="TYPE"
                        />
                    </div>
                    <div class="bg-bg-xstrong p-30 text-center br-s" v-else>
                        <fa icon="far fa-face-sad-tear" class="ft-xl color-ft-xweak line-1"></fa>

                        <p class="mt-10 color-ft-weak line-1">{{ profile.name }} n'a pas encore rempli son profil.</p>
                    </div>
                </div>
                <div class="col-5">
                    <div class="bg-bg-xstrong p-20 br-s">
                        <div class="" v-if="profile.createdAt">
                            <fa icon="far fa-cake-candles" class="mr-5" /> Nous a rejoint {{ $moment(profile.createdAt).fromNow() }}
                        </div>
                        <div class="mt-10" v-if="profile.gatheringsCount">
                            <fa icon="far fa-calendar" class="mr-5" /> {{ profile.gatheringsCount }} participations
                        </div>
                        <div class="mt-3" v-if="profile.encounterCount">
                            <fa icon="far fa-hand-wave" class="mr-5" /> {{ profile.encounterCount }} rencontres
                        </div>
                    </div>
                </div>
            </div>
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
        isSelf () { return this.profile && this.user.id == this.profile.id },
        tidbits () {
            return this.isSelf ? TIDBITS : TIDBITS.filter(t => this.getTidbit(t).value)
        }
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