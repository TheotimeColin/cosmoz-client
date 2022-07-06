<template>
    <div class="Page">
        <template v-if="profile && this.user">
            <div class="pv-10 ph-20" :class="profile.isFriend ? ['bg-cosmoz-strong'] : ['bg-bg-xweak', 'color-ft-light']" v-if="profile.isFriend || user.encounters.includes(profile._id)">
                <div class="ft-s-bold">
                    <div v-if="profile.isFriend">
                        <fa icon="far fa-sparkles" class="mr-3" /> Fait partie de ta constellation
                    </div>
                    <div v-else-if="user.encounters.includes(profile._id)">
                        <fa icon="far fa-hand-wave" class="mr-3" /> Vous vous êtes rencontrés
                    </div>
                </div>
            </div>

            <div class="bg-cover-25 bg-bg-xstrong" :style="{ '--background': `url(${$bg.holo})` }">
                <div class="fx-center width-100 d-block@xs p-30 ph-15@xs">
                    <div class="fx-center fx-no-shrink">
                        <div class="p-relative mr-20" @click="() => isSelf ? editSection = 'picture' : ''">
                            <user-icon
                                :no-link="isSelf"
                                :modifiers="$smallerThan('s') ? ['l'] : ['xl']"
                                :badge="isSelf ? 'pen' : ''"
                                v-bind="profile"
                            />
                        </div>
                        <div class="fx-grow">
                            <p class="ft-title-l ft-title-m@s">{{ profile.name }}</p>

                            <p class="ft-s-medium">
                                @{{ profile.id }}
                            </p>
                        </div>

                        <div class="d-none d-block@xs">
                            <quick-menu
                                class="ml-10"
                                :button="{ modifiers: ['xweak'] }"
                                :items="[
                                    { fa: 'times', label: 'Retirer de mes amis', action: unmatch }
                                ]"
                                v-if="!isSelf && profile.isFriend"
                            />
                        </div>
                    </div>

                    <div>
                        <button-base class="mt-20@xs" :modifiers="['s']" icon-before="check" v-if="!profile.isFriend && user.affinities.includes(profile._id)" @click="cancelFriendRequest" :loading="isLoading">
                            Demande envoyée
                        </button-base>
                        <button-base class="mt-20@xs" :modifiers="['light', 's']" icon-before="plus" v-else-if="!profile.isFriend && !isSelf" :loading="isLoading" @click="createFriendRequest">
                            Demander en ami
                        </button-base>
                        <button-base class="mt-20@xs" :modifiers="['light', 's']" icon-before="pen" @click="() => isSelf ? editSection = 'picture' : ''" v-else-if="isSelf">
                            Modifier mon profil
                        </button-base>
                        
                        <quick-menu
                            class="ml-10 d-none@xs"
                            :button="{ modifiers: ['xweak'] }"
                            :items="[
                                { fa: 'times', label: 'Retirer de mes amis', action: unmatch }
                            ]"
                            v-if="!isSelf && profile.isFriend"
                        />
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

            <div class="pv-20 br-xs o-hidden bg-cover-25 bg-night" v-if="isSelf && !user.picture">
                <div class="G_cosmoz"></div>
                
                <div class="Wrapper Wrapper--s p-relative fx-center d-block@xs">
                    <p class="ft-title-xs mr-10 mr-0@xs mb-10@xs">C'est quand même plus sympa avec une photo !</p>

                    <button-base :modifiers="['light', 's']" @click="editSection = 'picture'" icon-before="image">
                        Ajouter une image de profil
                    </button-base>
                </div>
            </div>

            <popin :is-active="isMatch" :modifiers="['xs']" @close="isMatch = false" >
                <template slot="content">
                    <div class="bg-cover bg-night text-center p-40 height-100">
                        <div class="d-flex fxa-center fxj-center">
                            <user-icon :modifiers="['xl']" v-bind="profile" :no-link="true" />

                            <fa icon="far fa-sparkles" class="mh-10" />

                            <user-icon :modifiers="['xl']" v-bind="user" :no-link="true" />
                        </div>

                        <div class="ft-title-m mt-30 mb-10">Nouvelle personne dans ta constellation</div>
                        <p class="mb-15">{{ profile.name }} a également envie de rester en contact !</p>

                        <div class="mt-20">
                            <button-base :modifiers="['light']" @click="isMatch = false">Fermer</button-base>
                        </div>
                    </div>
                </template>
            </popin>

            <div class="Page_wrapper Wrapper Wrapper--xs">
                <div class="block-r text-center fx-grow" v-if="mentions.length > 0">
                    <p class="ft-title-2xs text-left mb-15">Remerciements reçus par {{ profile.name }}</p>

                    <div class="ft-title-3xs tape m-3" v-for="mention in $groupBy(mentions, 'type', { orderBy: true })" :key="mention[0]">
                        {{ $const.mentions.find(m => m.value == mention[0]).emoji }} {{ $t('mentions.' + mention[0]) }} <span class="round round-s bg-bg-light ml-5">{{ mention[1].items.length }}</span>
                    </div>
                </div>
            </div>

            <profile-edit :is-active="editSection ? true : false" @close="editSection = null" @open="editSection = 'picture'" v-if="isSelf" />
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
        isLoading: false,
        isMatch: false
    }),
    computed: {
        
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
            this.$store.commit('page/popin', { confirm: {
                text: `Veux-tu vraiment retirer ${this.profile.name} de tes amis ?`,
                subtitle: `Nous ne l'informerons pas de ton choix, mais tu n'auras plus accès à son contenu.`,
                confirm: {
                    text: 'Retirer de mes amis',
                    modifiers: ['error'],
                    action: async () => {
                        await this.$store.dispatch('user/unmatch', this.profile)
                        if (this.$refs.feed) this.$refs.feed.refresh()
                    }
                }
            } })
        },
        async createFriendRequest () {
            this.isLoading = true
            
            try {
                const response = await this.$store.dispatch('user/createRequest', this.profile)

                if (response.match) {
                    this.isMatch = true
                    if (this.$refs.feed) this.$refs.feed.refresh()
                }
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