<template>
    <div class="Header"
        :class="{ 'is-open': isOpen, 'is-transparent': $store.state.page.header.transparent, 'is-scrolled': $store.state.page.isScrolled }">
        <div class="Header_wrapper">
            <div class="Header_left">
                <nuxt-link :to="localePath({ name: user ? 'feed' : 'index' })" class="Header_logo">
                    <img :src="assets.logo" height="20" class="n-mt-5">
                </nuxt-link>
            </div>

            <div class="Header_right" v-if="user">
                <button-base :modifiers="['', 's', 'user']" class="Header_profile"
                    :to="{ name: 'feed' }">
                    <user-icon :display-name="true" :no-link="true" v-bind="user" />
                </button-base>
            </div>
            <div class="Header_nav" v-else>
                <link-base class="Header_navItem" :to="{ name: 'explore-events' }" :modifiers="['current']">Nos rencontres
                </link-base>

                <link-base class="Header_navItem" :to="{ name: 'explore' }" :modifiers="['current']">Les communautés
                </link-base>

                <link-base class="Header_navItem" :modifiers="['current']"
                    @click="$store.commit('page/register', 'login')">
                    Se connecter</link-base>

                <div class="Header_navItem Header_navItem--button">
                    <button-base :modifiers="['light', 's']" @click="$store.commit('page/register', 'header')">
                        Je m'inscris
                    </button-base>
                </div>
            </div>

            <button-base :modifiers="['round', 'xweak']" class="Header_burger" :icon-before="isOpen ? 'times' : 'bars'" @click="isOpen = !isOpen" v-if="!user" />
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
        
        notifications () {
            return this.$store.getters['notification/find']({
                owner: this.user._id,
                state: 'unread'
            })
        },
    },
    mounted () {
        this.isLoading = false
    }
}
</script>

<style lang="scss">
    :root {
        --default-header-height: 65px;
    }
</style>

<style lang="scss" scoped>
.Header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 110;
    background-color: var(--color-bg-strong);
    transition: all 200ms ease;
    
    &.is-transparent {
        background-color: transparent;

        .Header_wrapper {
            border-color: transparent;
        }

        &.is-scrolled {
            background-color: var(--color-bg-strong);
        }
    }

    &.is-open {
        background-color: var(--color-bg-strong);
    }
}

.Header_button {

    & + & {
        margin-left: 20px;
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
    height: var(--default-header-height);
    display: flex;
    justify-content: space-between;
    position: relative;
    padding: 0 10px 0 5px;
    border-bottom: 1px solid var(--color-border-weak);
}

.Header_nav {
    display: flex;
    align-items: center;
    font: var(--ft-m-medium);
    line-height: 1;
}

.Header_right {
    display: flex;
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

.Header_profile {
    align-self: center;
}

@include breakpoint-s {
    .Header {
        box-shadow: 0 0 0 999px color-opacity('bg-2xstrong', -100%);

        &.is-open {
            box-shadow: 0 0 0 999px color-opacity('bg-2xstrong', -20%);
        }
    }

    .Header_burger {
        display: flex;
        align-self: center;
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

.Header_bars {
    display: none;
}

@include breakpoint-s {
    
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
        padding-left: 15px;
    }
}
</style>