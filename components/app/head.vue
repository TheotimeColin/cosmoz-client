<template>
    <div class="AppHeader" :class="{ 'is-scrolled': $store.state.page.isScrolled, 'is-hidden': !$appMeta, 'is-back': $appMeta.back, 'is-init': !changed }" v-if="$appMeta">
        <div class="Wrappers Wrappers--xs">
            <div class="AppHeader_wrapper pl-15 pl-0@s">
                <button-base icon-before="bars" class="mr-5" :modifiers="['', 'transparent', 'round']" @click="$emit('navOpen')" v-if="$smallerThan('s')" />

                <div class="AppHeader_left AppHeader_left--prev" v-if="prev">
                    <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                        {{ prev.title }}
                    </h1>
                </div>

                <div class="AppHeader_left">
                    <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                        {{ $appMeta.title }}
                    </h1>
                </div>
            </div>
            
            <!-- <div class="AppHeader_banner" :style="{ backgroundImage: `url(${$constellation.hero}` }" v-if="$constellation && $constellation.hero"></div> -->

            <div class="AppHeader_secondary p-10" v-if="items.length > 0">
                <nav-bar :items="items" />
            </div>
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
        items () {
            if (!this.$constellation) return []
            
            return [
                {
                    id: 'index',
                    label: `Activité`,
                    fa: 'home',
                    to: { name: 'c-slug-feed', params: { slug: this.$constellation.slug } }
                },
                {
                    id: 'events',
                    label: `Événements`,
                    fa: 'calendar',
                    to: { name: 'c-slug-events', params: { slug: this.$constellation.slug } },
                    disabled: this.type == 'group'
                },
                {
                    id: 'feed',
                    label: `Discussions`,
                    fa: 'comments',
                    to: { name: 'c-slug-discussions', params: { slug: this.$constellation.slug } }
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

            if (v.isPanel) {
                setTimeout(() => {
                    document.documentElement.style.setProperty('--sticky-height', '0px')
                }, 300)
            } else {
                document.documentElement.style.removeProperty('--sticky-height', '0px')
            }

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
        --app-height: 0px;
    }
</style>

<style lang="scss" scoped>

.AppHeader {
    position: sticky;
    top: 0;
    // position: fixed;
    margin-top: var(--header-height);
    margin-left: var(--nav-width);
    left: 0;
    // width: 100%;
    z-index: 90;
    background-color: var(--color-bg-xstrong);
    transition: all 100ms ease;
    overflow: hidden;
    @include shadow;

    &.is-init {

        .AppHeader_left {
            transform: translateY(0%);
            opacity: 1;
            transition: all 200ms ease;
        }
        
        .AppHeader_left--prev {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
}

.AppHeader_banner {
    height: 150px;
    background-size: cover;
    background-position: center;
}

.AppHeader_secondary {
    background-color: var(--color-bg-strong);
}

.AppHeader_iconContainer {
    flex-shrink: 0;
    // height: var(--app-height);
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
    display: flex;
    height: 60px;
    align-items: center;
    position: relative;
    z-index: 30;
    transform: translateY(100%);
    opacity: 0;
}

.AppHeader_left--prev {
    position: absolute;
    left: 0;
    transform: translateY(0%);
    opacity: 1;
}

.AppHeader_wrapper {
    height: var(--app-height);
    display: flex;
    align-items: center;
    position: relative;
}

.AppHeader_right {
    display: flex;
    margin-left: 20px;
    padding-right: 10px;
}

@include breakpoint-s {
    .AppHeader {
        margin-left: 0;
        margin-top: 0;
    }
}
</style>