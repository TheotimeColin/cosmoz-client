<template>
    <div class="DefaultHeader" :class="{ 'is-open': isOpen }">
        <div class="DefaultHeader_wrapper Wrapper">
            <a :href="$config.baseUrl" class="DefaultHeader_logo ft-title-m logo-sparkle-p">
                cosmoz
            </a>

            <div class="DefaultHeader_nav">
                <link-base :href="$config.blogUrl" class="DefaultHeader_navItem" :modifiers="['current']" @click="isOpen = false">Le super blog</link-base>
                
                <template v-if="user">
                    <button-base :href="$config.appUrl" :modifiers="['light', 's']" class="ml-15 d-none@s" @click="isNewsletter = true">
                        Mon espace
                    </button-base>
                </template>
                <template v-else>
                    <link-base :href="$config.appUrl" class="DefaultHeader_navItem" :modifiers="['current']" @click="isOpen = false">Se connecter</link-base>

                    <button-base :modifiers="['light', 's']" class="ml-15 d-none@s" @click="isNewsletter = true">
                        Pré-inscription
                    </button-base>
                </template> 
            </div>

            <div class="DefaultHeader_burger" @click="isOpen = !isOpen">
                <fa icon="far fa-bars" v-if="!isOpen"></fa>
                <fa icon="far fa-times" v-else></fa>
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
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>

<style lang="scss" scoped>
    .DefaultHeader {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 90;
        background-color: var(--color-bg-2xstrong);
    }

    .DefaultHeader_wrapper {
        height: 60px;
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
            background-color: var(--color-bg-2xstrong);
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