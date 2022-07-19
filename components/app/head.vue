<template>
    <div class="AppHeader" :class="{ 'is-scrolled': $store.state.page.isScrolled, 'is-hidden': !$appMeta, 'is-back': $appMeta.back, 'is-init': !changed, 'is-hero': $constellation && $constellation.hero && !($route.params.eventId) }" v-if="$appMeta">
        <div class="AppHeader_wrapper pl-15 pl-5@s">
            <button-base icon-before="bars" class="mr-3" :modifiers="['', 'transparent', 'round']" @click="$emit('navOpen')" v-if="$smallerThan('s')" />

            <div v-if="$constellation">
                <const-icon class="mr-15" v-bind="$constellation" />
            </div>
            <div v-else-if="$biggerThan('s')">
                <fa icon="far fa-home" class="mr-15" />
            </div>

            <div class="AppHeader_left">
                <div class="AppHeader_leftPrev ft-title-xs line-1 ellipsis-1 ellipsis-break" v-if="prev">
                    {{ prev.title }}
                </div>

                <h1 class="AppHeader_leftCurrent ft-title-xs line-1 ellipsis-1 ellipsis-break">
                    {{ $appMeta.title }}
                </h1>
            </div>

            <div class="AppHeader_right" v-if="user">
                <button-icon class="ml-20" fa="circle-plus" @click="$store.commit('page/popin', { create: true, reset: true })" v-if="$biggerThan('s')" />

                <button-icon class="ml-20" fa="paper-plane" :to="{ name: 'messages-channel' }" :notification="channels.length" />

                <button-icon class="ml-20" fa="bell" @click="() => $store.commit('page/toggleNotifs', true)" :notification="notifications.length" />

                <div class="Header_profile ml-20"  v-if="$biggerThan('s')">
                    <button-base :modifiers="['s']" :image="user.profileSmall" :text="user.name" />

                    <div class="Header_profileNav">
                        <nav-list :items="userItems" />
                    </div>
                </div>
            </div>
            <div class="AppHeader_right" v-else>
                <link-base class="ml-20" :to="{ name: 'g' }" :modifiers="['current']">Nos rencontres
                </link-base>

                <link-base class="ml-20" :modifiers="['current']"
                    @click="$store.commit('page/register', 'login')">
                    Se connecter</link-base>

                <div class="ml-20">
                    <button-base :modifiers="['light', 's']" @click="$store.commit('page/register', 'header')">
                        Je m'inscris
                    </button-base>
                </div>
            </div>
        </div>
        
        <div class="AppHeader_banner" :style="{ backgroundImage: `url(${$constellation ? $constellation.hero : ''}` }"></div>

        <div class="fx-center p-15 bg-cosmoz" v-if="$constellation && !$constellation.isMember">
            <div class="mr-10" v-if="$constellation.isFollower">
                <p class="ft-title-2xs ellipsis-1">Demande envoyée</p>
            </div>
            <div class="mr-10" v-else>
                <p class="ft-title-2xs ellipsis-1">Rejoins {{ $constellation.name }}</p>
                <p class="ft-s mt-3" v-if="!$constellation.isFollower">Découvre les membres et le contenu publié par la communauté.</p>
            </div>
            
            <link-base :to="{ name: 'c-slug-rejoindre', params: { slug: $constellation.slug } }" v-if="$constellation.isFollower">Voir la demande</link-base>
            <button-base :to="{ name: 'c-slug-rejoindre', params: { slug: $constellation.slug } }" :modifiers="['round', 'light']" icon-before="arrow-right" v-else />
        </div>

        <div class="AppHeader_secondary pv-10" v-if="items.length > 0">
            <nav-bar :items="items" :ph="10" />
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'
import { getMeta } from '@/utils/meta'

export default {
    name: 'AppHeader',
    mixins: [ ConstellationMixin ],
    data: () => ({
        prev: {},
        changed: false,
    }),
    computed: {
        $appMeta() { return getMeta(this.$route, this.$store) },
        channels () {
            return this.$store.getters['channel/find']({
                users: { $contains: this.user._id },
                unread: true
            })
        },
        notifications() {
            return this.user ? this.$store.getters['notification/find']({
                owner: this.user._id,
                state: 'unread'
            }) : []
        },
        userItems () {
            if (!this.user) return []

            return [
                {
                    label: `Mon réseau`,
                    fa: 'sparkles',
                    to: { name: 'constellation' }
                }, {
                    label: `Voir mon profil`,
                    fa: 'user',
                    to: { name: 'p-userId', params: { userId: this.user.id } }
                }, {
                    label: `Mes paramètres`,
                    fa: 'cog',
                    to: { name: 'compte' }
                }, {
                    label: `Me déconnecter`,
                    fa: 'arrow-right-from-bracket',
                    to: { name: 'compte-logout' }
                }
            ]
        },
        items () {
            if (!this.$constellation) return []
            
            return [
                {
                    id: 'index',
                    label: `Activité`,
                    fa: 'home',
                    to: { name: 'c-slug', params: { slug: this.$constellation.slug } }
                },
                {
                    id: 'events',
                    label: `Événements`,
                    number: this.$gatherings.filter(g => !g.isPast).length,
                    fa: 'calendar',
                    to: { name: 'c-slug-events', params: { slug: this.$constellation.slug } },
                    disabled: this.type == 'group'
                },
                {
                    id: 'feed',
                    label: `Discussions`,
                    fa: 'comments',
                    to: { name: 'c-slug-discussions', params: { slug: this.$constellation.slug } },
                    notification: this.$constellation.lastPosts > 0
                },
                {
                    id: 'members',
                    label: `Membres`,
                    fa: 'users',
                    to: { name: 'c-slug-members', params: { slug: this.$constellation.slug } }
                },
            ]
        }
    },
    watch: {
        $appMeta (v) {
            if (v) {
                document.documentElement.style.removeProperty('--app-height', '0px')
            } else {
                document.documentElement.style.setProperty('--app-height', '0px')
            }

            // if (v.isPanel) {
            //     setTimeout(() => {
            //         document.documentElement.style.setProperty('--sticky-height', '0px')
            //     }, 300)
            // } else {
            //     document.documentElement.style.removeProperty('--sticky-height', '0px')
            // }

            if (this.prev?.title !== v?.title && !this.changed) {
                this.changed = true

                setTimeout(() => {
                    this.changed = false
                }, 0)
                
                setTimeout(() => {
                    this.prev = v
                }, 200)
            }
        },
    },
    mounted () {
        this.prev = this.$appMeta
    },
    methods: {
        onIconClick () {
            if (this.$appMeta && this.$appMeta.back) {
                this.$router.push(this.localePath(this.$appMeta.back))
            } else {
                this.$router.back()
            }
        }
    },
    head () {
        let title = '(0) ' + (this.$appMeta?.title ? this.$appMeta.title : '') + ' ' + this.$t('meta.append')

        if (this.notifications?.length > 0) {
            title = title.replace(/[0-9]/, this.notifications.length)
        } else {
            title = title.replace(/ *\([^)]*\) */g, "")
        }

        return {
            title: title,
            link: [
                { rel: 'icon', type: 'image/x-icon', href: `/${this.$config.isDev ? 'favicon_local' : 'favicon'}${this.notifications?.length > 0 ? '_notification' : ''}.png?${Math.random()}`  }
            ]
        }
    }
}
</script>

<style lang="scss">
    :root {
        --app-height: 60px;
    }
</style>

<style lang="scss" scoped>

.AppHeader {
    position: sticky;
    top: 0;
    // position: fixed;
    // margin-top: var(--header-height);
    // margin-left: var(--nav-width);
    left: 0;
    // width: 100%;
    z-index: 90;
    transition: all 100ms ease;

    &.is-init {

        .AppHeader_leftCurrent {
            transform: translateY(0%);
            opacity: 1;
            transition: all 200ms ease;
        }
        
        .AppHeader_leftPrev {
            transform: translateY(-100%);
            opacity: 0;
        }
    }

    &.is-hero {
        top: calc(-200px + var(--app-height));

        .AppHeader_banner {
            height: 200px;
        }
    }
}

.AppHeader_banner {
    height: var(--app-height);
    background-size: cover;
    background-position: center;
}

.AppHeader_secondary {
    background-color: var(--color-bg-weak);
}

.AppHeader_iconContainer {
    flex-shrink: 0;
    height: var(--app-height);
    width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    position: relative;
    font-size: 15px;
}

.AppHeader_button {
    padding: 0 10px;
}

.AppHeader_left {
    flex-grow: 1;
    position: relative;
    z-index: 30;
    overflow: hidden;
}

.AppHeader_leftPrev,
.AppHeader_leftCurrent {
    display: block;
    white-space: nowrap;
    align-items: center;
    transform: translateY(100%);
    opacity: 0;
}

.AppHeader_leftPrev {
    position: absolute;
    left: 0;
    transform: translateY(0%);
    opacity: 1;
}

.AppHeader_right {
    display: flex;
    height: 60px;
    align-items: center;
    justify-content: flex-end;
    flex-grow: 1;
    padding-right: 15px;
}

.AppHeader_wrapper {
    height: var(--app-height);
    background-color: var(--color-bg);
    display: flex;
    align-items: center;
    position: fixed;
    left: var(--nav-width);
    top: 0;
    width: calc(100% - var(--nav-width));
}

.Header_profile {
    position: relative;

    &:hover .Header_profileNav {
        opacity: 1;
        pointer-events: all;
    }
}

.Header_profileNav {
    position: absolute;
    bottom: -6px;
    right: 0;
    width: 250px;
    transform: translateY(100%);
    padding: 6px;
    border-radius: 6px;
    background-color: var(--color-bg-xstrong);
    @include shadow;

    pointer-events: none;
    opacity: 0;
    transition: all 150ms ease;

    &::before {
        content: "";
        display: block;
        position: absolute;
        top: -15px;
        height: 15px;
        width: 100%;
    }
}

@include breakpoint-s {
    .AppHeader {
        margin-left: 0;
        margin-top: 0;
    }

    .AppHeader_wrapper {
        left: 0;
        width: 100%;
    }
}
</style>