<template>
    <div class="DefaultHeader" :class="{ 'is-open': isOpen }">
        <div class="DefaultHeader_wrapper Wrapper">
            <nuxt-link :to="localePath({ name: '' })" class="DefaultHeader_logo ft-title-m logo-sparkle">
                gatherings
            </nuxt-link>

            <div class="DefaultHeader_nav">
                <link-base :href="$config.baseUrl + '#about'" class="DefaultHeader_navItem" @click="isOpen = false">C'est quoi Gatherings ?</link-base>

                <link-base :href="$config.baseUrl + '#about'" class="DefaultHeader_navItem is-ocean" :modifiers="['current']" @click="isOpen = false">Devenir partenaire</link-base>
            </div>

            <div class="DefaultHeader_burger" @click="isOpen = !isOpen">
                <i class="fal fa-bars" v-if="!isOpen"></i>
                <i class="fal fa-times" v-else></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DefaultHeader',
    data: () => ({
        isOpen: false
    })
}
</script>

<style lang="scss" scoped>
    .DefaultHeader {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 90;
        background-color: var(--color-bg-strong);
    }

    .DefaultHeader_wrapper {
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .DefaultHeader_nav {
        font: var(--ft-m-medium);
    }

    .DefaultHeader_burger {
        width: 45px;
        height: 45px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 22px;
    }

    .DefaultHeader_navItem {

        & + & {
            margin-left: 15px;
        }
    }

    @include breakpoint-s {
        .DefaultHeader_burger {
            display: flex;
        }

        .DefaultHeader_logo {

            &::before {
                display: none;
            }
        }

        .DefaultHeader_nav {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            transform: translateY(100%);
            z-index: 100;
            display: none;
            background-color: var(--color-bg-strong);
            border-top: 1px solid var(--color-border);
            transition: all 200ms ease;
        }

        .DefaultHeader_wrapper {
            padding: 0 10px 0 16px;
        }
            
        .DefaultHeader_navItem {
            display: block;
            padding: 20px 0;
            margin: 0 20px;
            border-bottom: 1px solid var(--color-border);

            &:last-child {
                border: none;
            }
            
            & + & {
                margin-left: 20px;
            }
        }

        .DefaultHeader.is-open {

            .DefaultHeader_nav {
                display: block;
            }
        }
    }
</style>