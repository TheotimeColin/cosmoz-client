<template>
    <div class="Header" :class="{ 'is-open': isOpen, 'is-transparent': $store.state.page.header.transparent, 'is-scrolled': $store.state.page.isScrolled }">
        <div class="Header_wrapper">
            <div class="Header_left" @mouseenter="isNavOpen = true" @mouseleave="isNavOpen = false">
                <button-base :modifiers="['round', 'xweak']" class="Header_button d-none@s" icon-before="bars" v-if="user" />
                <div class="mr-10" v-else></div>
                
                <nuxt-link :to="localePath({ name: 'index' })" class="Header_logo ft-title-xs">
                    <img :src="assets.logo" height="24" class="n-mt-5"> social
                </nuxt-link>
            </div>

            <div class="Header_nav">
                <link-base :href="$config.baseUrl" class="Header_navItem" :modifiers="['current']" @click="isOpen = false">Cosmoz events</link-base>

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
        isNavOpen: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    mounted () {
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
    .Header {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 90;
        background-color: rgba(0, 0, 0, 0);
        border-bottom: 1px solid var(--color-border); 
        transition: all 250ms ease;

        &.is-transparent {
            background-color: rgba(0, 0, 0, 0);
            border-color: rgba(0, 0, 0, 0);
            transition: none;

            .Header_button.QuickMenu ::v-deep .QuickMenu_button,
            .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
                background-color: var(--color-bg-xstrong);
            }
        }

        &.is-scrolled {
            background-color: var(--color-bg-xstrong);
            border-color: rgba(0, 0, 0, 0);
            
            .Header_button.QuickMenu ::v-deep .QuickMenu_button,
            .Header_button:not(.ButtonBase--xweak):not(.QuickMenu) {
                background-color: var(--color-bg-weak);
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
        display: flex;
        align-items: center;
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
            background-color: var(--color-bg-xstrong);
        }

        .Header.is-open {

            .Header_nav {
                display: block;
            }
        }
    }
</style>