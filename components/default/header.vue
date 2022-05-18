<template>
    <div class="Header" :class="{ 'is-open': isOpen, 'is-transparent': $store.state.page.header.transparent, 'is-scrolled': $store.state.page.isScrolled }">
        <div class="Header_wrapper">
            <div class="Header_left" @mouseenter="isNavOpen = true" @mouseleave="isNavOpen = false">
                <button-base :modifiers="['round', 'xweak']" class="Header_button d-none@s" icon-before="bars" v-if="user" />
                <div class="mr-10" v-else></div>
                
                <nuxt-link :to="localePath(user ? { name: 'feed' } : { name: 'index' })" class="Header_logo ft-title-m logo-sparkle-p">
                    cosmoz
                </nuxt-link>
            </div>

            <div class="Header_right" v-if="user">
                <button-base :modifiers="['weak', 'user']" :to="{ name: 'p-id', params: { id: user.id } }" class="Header_button d-none@xs">
                    <user-icon :display-name="true" :no-link="true" v-bind="user" />
                </button-base>

                <button-base :modifiers="['round', 'weak']" class="Header_button" icon-before="bell" />

                <quick-menu
                    :large="true"
                    icon="caret-down"
                    class="Header_button d-none@xs"
                    :items="[
                        { fa: 'gear', to: { name: 'compte' }, label: `Mes paramètres` },
                        { fa: 'arrow-right-from-bracket', to: { name: 'compte-logout'}, label: `Se déconnecter` }
                    ]"
                />
            </div>
            <div class="Header_nav" v-else>
                <link-base :to="{ name: 'g' }" class="Header_navItem" :modifiers="['current']" @click="isOpen = false">Les événements</link-base>

                <link-base :href="$config.blogUrl" class="Header_navItem" :modifiers="['current']" @click="isOpen = false">Le super blog</link-base>

                <link-base :to="{ name: 'compte-login' }" class="Header_navItem" :modifiers="['current']" @click="isOpen = false">Se connecter</link-base>

                <div class="Header_navItem Header_navItem--button">
                    <button-base :modifiers="['light', 's']" @click="isNewsletter = true">
                        Pré-inscription
                    </button-base>
                </div>
            </div>

            <button-base :modifiers="['round', 'xweak']" class="Header_burger" :icon-before="isOpen ? 'times' : 'bars'" @click="isOpen = !isOpen" v-if="!user" />
        </div>

        <popin-newsletter :is-active="isNewsletter" origin="header" @close="isNewsletter = false" />

        <default-nav :is-active="isNavOpen" v-if="user" />
    </div>
</template>

<script>
export default {
    name: 'Header',
    data: () => ({
        isOpen: false,
        isNavOpen: false,
        isNewsletter: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>

<style lang="scss" scoped>
    .Header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 90;
        background-color: var(--color-bg-strong);
        border-bottom: 1px solid var(--color-border); 
        transition: all 250ms ease;

        &.is-transparent {
            background-color: transparent;
            border-color: transparent;

            .Header_button.QuickMenu ::v-deep .QuickMenu_button,
            .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
                background-color: var(--color-bg-xstrong);
            }
        }

        &.is-scrolled {
            background-color: var(--color-bg-xstrong);
            border-color: transparent;
            
            .Header_button.QuickMenu ::v-deep .QuickMenu_button,
            .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
                background-color: var(--color-bg-strong);
            }
        }

        &.is-open {
            background-color: var(--color-bg-xstrong);
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
    }

    .Header_wrapper {
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 0 15px 0 5px;
    }

    .Header_nav {
        font: var(--ft-m-medium);
        line-height: 1;
    }

    .Header_right {
        display: flex;
        align-items: center;
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
            background-color: var(--color-bg-2xstrong);
        }

        .Header.is-open {

            .Header_nav {
                display: block;
            }
        }
    }
</style>