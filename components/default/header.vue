<template>
    <div class="DefaultHeader" :class="{ 'is-open': isOpen }">
        <div class="DefaultHeader_wrapper Wrapper">
            <a :href="$config.baseUrl" class="DefaultHeader_logo ft-title-m logo-sparkle">
                gatherings
            </a>

            <div class="DefaultHeader_nav">
                <link-base :href="$config.blogUrl" class="DefaultHeader_navItem" :modifiers="['current']" @click="isOpen = false">Le super blog</link-base>
                
                <a href="https://www.instagram.com/gatheringsfr" class="DefaultHeader_navItem" target="_blank">
                    <icon-base name="icon/instagram" class="fill-ft-light" :width="20" /> <span class="d-none ml-10 d-block@s">Gatherings sur Instagram</span>
                </a>

                <button-base :modifiers="['light', 's']" class="ml-20 d-none@s" @click="isNewsletter = true">
                    Trouver ma constellation
                </button-base>

                
                <link-base class="DefaultHeader_navItem d-none d-block@s" @click="isNewsletter = true">Trouver ma constellation</link-base>
            </div>

            <div class="DefaultHeader_burger" @click="isOpen = !isOpen">
                <i class="fal fa-bars" v-if="!isOpen"></i>
                <i class="fal fa-times" v-else></i>
            </div>
        </div>

        <popin-newsletter :is-active="isNewsletter" origin="header" @close="isNewsletter = false" />
    </div>
</template>

<script>
export default {
    name: 'DefaultHeader',
    data: () => ({
        isOpen: false,
        isNewsletter: false
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
        display: flex;
        align-items: center;
        font: var(--ft-m-medium);
        line-height: 1;
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
        font: var(--ft-s);
        line-height: 1;
        display: flex;
        align-items: center;

        &.d-none { display: none; }
        
        & + & {
            margin-left: 20px;
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
            display: flex;
            padding: 20px 0;
            margin: 0 20px;
            border-bottom: 1px solid var(--color-border);

            &.d-block\@s { display: flex; }

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