<template>
    <div class="Header" :class="{ 'is-open': isOpen, 'is-transparent': $store.state.page.header.transparent, 'is-scrolled': $store.state.page.isScrolled }">
        <div class="Header_wrapper">
            <div class="Header_left">
                <div class="Header_bars" @click="$emit('navOpen')">
                    <fa icon="far fa-bars" />
                </div>
                
                <nuxt-link :to="localePath(user ? { name: 'feed' } : { name: 'index' })" class="Header_logo">
                    <img :src="assets.logo" height="20" class="n-mt-5">
                </nuxt-link>

                <p class="ft-title-xs ellipsis-1 ellipsis-break hide show@s">
                    {{ subtitle ? subtitle : '' }}
                </p>
            </div>

            <div class="Header_right" v-if="user">
                <button-base :modifiers="['round', 'weak']" :href="$config.adminUrl" class="Header_button" icon-before="crown" v-if="user.role == 'admin'"/>

                <button-base :modifiers="['weak', 's', 'user']" :to="{ name: 'p-id', params: { id: user.id } }" class="Header_button d-none@xs">
                    <user-icon :display-name="true" :no-link="true" v-bind="user" />
                </button-base>
                
                <button-base :modifiers="['round', 's', 'weak']" :to="{ name: 'g' }" class="Header_button d-none@xs" icon-before="calendar" />

                <button-base :modifiers="['round', 's', 'weak']" class="Header_button" icon-before="paper-plane" />

                <button-base :modifiers="['round', 's', 'weak']" class="Header_button" icon-before="bell" />

                <quick-menu
                    :large="true"
                    :modifiers="['s']"
                    icon="caret-down"
                    class="Header_button d-none@xs"
                    :items="[
                        { fa: 'sparkles', to: { name: 'constellation' }, label: `Ma constellation` },
                        { fa: 'question-circle', to: { name: 'faq' }, label: `Une question ?` },
                        { fa: 'gear', to: { name: 'compte' }, label: `Mon compte` },
                        { fa: 'arrow-right-from-bracket', to: { name: 'compte-logout'}, label: `Se déconnecter` }
                    ]"
                />
            </div>
            <div class="Header_nav" v-else>
                <link-base class="Header_navItem" :to="{ name: 'g' }" :modifiers="['current']">Nos rencontres</link-base>

                <link-base class="Header_navItem" :modifiers="['current']"  @click="$store.commit('page/register', 'login')">Se connecter</link-base>

                <div class="Header_navItem Header_navItem--button">
                    <button-base :modifiers="['light', 's']" @click="$store.commit('page/register', 'header')">
                        Je m'inscris
                    </button-base>
                </div>
            </div>

            <button-base :modifiers="['round', 'xweak']" class="Header_burger" :icon-before="isOpen ? 'times' : 'bars'" @click="isOpen = !isOpen" v-if="!user && !isLoading" />
        </div>
    </div>
</template>

<script>
import logo from '@/assets/img/logo/logo_white_sparkles.webp'

export default {
    name: 'Header',
    data: () => ({
        assets: { logo },
        isLoading: true,
        isOpen: false,
        isNavOpen: false,
        nav: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        subtitle () { return this.$store.state.page.subtitle },
        fa () { return this.$store.state.page.fa }
    },
    mounted () {
        this.isLoading = false

        this.nav = [
            {
                label: `Actualité`,
                fa: 'home',
                to: this.localePath({ name: 'feed' }),
            },
            {
                label: `Sortir`,
                fa: 'calendar',
                to: this.localePath({ name: 'g' }),
                items: [
                    {
                        label: `Participer à une rencontre`,
                        to: this.localePath({ name: 'g' })
                    }, {
                        label: `Mes rencontres passées`,
                        to: this.localePath({ name: 'g-past' })
                    }
                ]
            }
        ]
    }
}
</script>

<style lang="scss">
    :root {
        --header-height: 58px;
    }
</style>

<style lang="scss" scoped>
.Header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 90;
    background-color: var(--color-bg-strong);
    transition: all 100ms ease;

    &.is-transparent {
        background-color: rgba(0, 0, 0, 0);
        border-color: rgba(0, 0, 0, 0);

        .Header_button.QuickMenu ::v-deep .QuickMenu_button,
        .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
            background-color: var(--color-bg-strong);
        }
    }

    &.is-scrolled {
        background-color: var(--color-bg-strong);
        border-color: rgba(0, 0, 0, 0);
        
        .Header_button.QuickMenu ::v-deep .QuickMenu_button,
        .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
            background-color: var(--color-bg);
        }
    }

    &.is-open {
        background-color: var(--color-bg-strong);
    }
}

.Header_button {

    & + & {
        margin-left: 3px;
    }
}

.Header_left {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 30;
    padding-left: 10px;
}

.Header_wrapper {
    height: var(--header-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    padding: 0 10px 0 5px;
}

.Header_nav {
    display: flex;
    align-items: center;
    font: var(--ft-m-medium);
    line-height: 1;
}

.Header_right {
    display: flex;
    align-items: center;
    margin-left: 20px;
}

.Header_burger {
    display: none;
}

.Header_navItem {
    font: var(--ft-title-3xs);
    line-height: 1;
    display: flex;
    align-items: center;

    &.d-none { display: none; }
    
    & + & {
        margin-left: 20px;
    }
}

@include breakpoint-s {
    .Header {
        box-shadow: 0 0 0 999px rgba(39, 39, 43, 0);

        &.is-open {
            box-shadow: 0 0 0 999px rgba(39, 39, 43, 0.8);
        }
    }

    .Header_burger {
        display: flex;
    }

    .Header_nav {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        transform: translateY(100%);
        z-index: 100;
        display: none;
        background-color: var(--color-bg-xstrong);
        border-top: 1px solid var(--color-border-weak);
        transition: all 200ms ease;
    }

    .Header_wrapper {
        padding: 0 10px 0 15px;
    }
        
    .Header_navItem {

        &.LinkBase  {
            display: flex;
            padding: 20px 0;
            margin: 0 20px;
        }

        &.d-block\@s { display: flex; }

        &:last-child {
            border: none;
        }
        
        & + & {
            border-top: 1px solid var(--color-border-weak);
            margin-left: 20px;
        }
    }

    .Header_navItem.Header_navItem--button {
        margin: 0;
        text-align: center;
        padding: 15px;
        background-color: var(--color-bg-xstrong);
    }

    .Header.is-open {

        .Header_nav {
            display: block;
        }
    }
}

.AppNav_navBar,
.Header_bars {
    display: none;
}

@include breakpoint-s {
    
    .AppNav_container,
    .Header_logo {
        display: none;
    }

    .Header_wrapper {
        padding: 0 10px 0 0;
    }

    .Header_bars {
        display: flex;
        padding: 20px;
        position: relative;
        z-index: 5;
    }

    .Header_left {
        padding: 0;
    }
}
</style>