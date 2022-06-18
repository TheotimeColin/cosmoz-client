<template>
    <div class="Page">
        <template v-if="profile && this.user">
            <div class="bg-cover-10 bg-bg-xstrong" :style="{ '--background': `url(${$bg.holo})` }">
                <div class="fx-center width-100 d-block@xs p-30">
                    <div class="fx-center fx-no-shrink">
                        <div class="p-relative mr-20" @click="() => isSelf ? editSection = 'picture' : ''">
                            <user-icon
                                :no-link="isSelf"
                                :modifiers="$smallerThan('s') ? ['l'] : ['xl']"
                                v-bind="profile"
                            />

                            <div class="Profile_pictureOverlay" v-if="isSelf">
                                <fa icon="far fa-camera" />
                            </div>
                        </div>
                        <div class="fx-grow">
                            <div class="d-flex fxa-center">
                                <p class="ft-title-l ft-title-m@s">{{ profile.name }}</p>
                                
                                <quick-menu
                                    class="ml-10 d-none@s"
                                    :modifiers="['right']"
                                    :items="[
                                        { fa: 'times', label: 'Retirer de ta constellation', action: unmatch }
                                    ]"
                                    v-if="!isSelf && profile.isFriend"
                                />
                            </div>

                            <div class="ft-m" v-if="profile.isFriend">
                                Fait partie de ta constellation
                            </div>
                            <div class="ft-m" v-else-if="user.encounters.includes(profile._id)">
                                Vous vous êtes rencontrés
                            </div>
                        </div>
                    </div>

                    <!-- <div class="ml-40 text-right fx-grow ml-0@xs mt-20@xs text-left@xs" v-if="mentions.length > 0">
                        <div class="ft-title-3xs tape tape-strong m-3" v-for="(items, type) in $groupBy(mentions, 'type')" :key="type">
                            {{ $t('mentions.' + type) }} <span class="round round-s bg-bg-weak ml-5">{{ items.length }}</span>
                        </div>
                    </div> -->

                    <div class="mt-10@xs">
                        <button-base :modifiers="['ss']" icon-before="check" v-if="!profile.isFriend && user.affinities.includes(profile._id)" @click="cancelFriendRequest" :loading="isLoading">
                            Demande envoyée
                        </button-base>
                        <button-base :modifiers="['light']" icon-before="plus" v-else-if="!profile.isFriend && !isSelf" :loading="isLoading" @click="createFriendRequest">
                            Demander en ami
                        </button-base>
                    </div>
                </div>
            </div>

            <!-- <div class="Wrapper pv-60 pv-30@xs">
                <div class="row-s">
                    <div class="col-7 col-12@s">
                        <content-feed
                            class="mb-60"
                            :author="profile._id"
                            :disable-create="!isSelf"
                        />
                    </div>
                    <div class="col-5 col-12@s">
                        <div class="bg-bg-weak p-20 br-s mb-20" v-if="common.length > 0 && !isSelf">
                            <p class="ft-title-2xs">Relations en commun</p>

                            <div class="row-xs mt-10">
                                <div class="col-6 col-12@s mt-10" v-for="user in common" :key="user._id">
                                    <user-icon :display-name="true" v-bind="user" />
                                </div>
                            </div>
                        </div>

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
                    </div>
                </div>
            </div> -->

            <div class="Page_wrapper Wrapper Wrapper--xs">
                <content-feed
                    :author="profile._id"
                    :disable-create="true"
                />
            </div>

            <popin :is-active="editSection" @close="editSection = null" v-if="isSelf">
                <template slot="content">
                    <div class="p-30">
                        <profile-edit :section="editSection" />
                    </div>
                </template>
            </popin>
        </template>
        <template v-else>
            <app-banner :background="$bg.holo" />

            <div class="Wrapper Wrapper--s">
                <div class="n-mt-30 bg-bg-xstrong color-ft-weak p-30 text-center br-s p-relative" v-if="!this.user">
                    <p>Les profils sont accessibles uniquement par les membres inscrits.</p>

                    <button-base :modifiers="['light']" class="mt-20" @click="$store.commit('page/register', 'profile')">
                        Je m'inscris
                    </button-base>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
const TIDBITS = ['socials', 'anything']

export default {
    name: 'ProfilePage',
    layout: 'app',
    middleware: ['loggedUser'],
    transition (to, from) {
        if (to.name.includes('userId')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    async fetch () {
        await this.$store.dispatch('user/fetchOne', this.$route.params.userId)

        if (this.target) {
            await this.$store.dispatch('mention/fetch', { query: {
                target: this.target._id
            }})
        }
    },
    data: () => ({
        TIDBITS,
        editSection: null,
        common: [],
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        target () { return this.$store.getters['user/findOne']({ id: this.$route.params.userId }) },
        profile () { return this.user && this.$route.params.id == this.user.id ? this.user : this.target },
        isSelf () { return this.user && this.profile && this.user.id == this.profile.id },
        tidbits () {
            return this.isSelf ? TIDBITS : TIDBITS.filter(t => this.getTidbit(t).value)
        },
        mentions () {
            return this.$store.getters['mention/find']({
                target: this.profile._id
            })
        }
    },
    watch: {
        profile: {
            immediate: true,
            async handler (v) {
                if (v && this.user) {
                    // this.common = await this.$store.dispatch('user/softFetch', {
                    //     items: [ ...new Set(v.friends.filter(u => this.user.friends.includes(u))) ]
                    // })
                }
            }
        }
    },
    methods: {
        getTidbit (type) {
            let result = this.profile.tidbits && this.profile.tidbits.find(t => t.type == type)
            return result ? result : {}
        },
        async unmatch () {
            this.isLoading = true
            
            try {
                await this.$store.dispatch('user/unmatch', this.profile)
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        async createFriendRequest () {
            this.isLoading = true
            
            try {
                const response = await this.$store.dispatch('user/createRequest', this.profile)
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        },
        async cancelFriendRequest () {
            this.isLoading = true
            
            try {
                await this.$store.dispatch('user/cancelRequest', this.profile)
            } catch (e) {
                console.error(e)
            }

            this.isLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }
    
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