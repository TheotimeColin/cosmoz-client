<template>
    <div class="BlogHeader" :class="{ 'is-open': isOpen }">
        <div class="BlogHeader_wrapper Wrapper">
            <a :href="$config.blogUrl" class="BlogHeader_logo ft-title-m logo-sparkle">
                cosmoz

                <span class="tape">le blog</span>
            </a>

            <div class="BlogHeader_nav">
                <link-base :href="$config.baseUrl" class="BlogHeader_navItem" @click="isOpen = false">Découvrir Cosmoz</link-base>

                <a href="https://www.instagram.com/gatheringsfr" class="BlogHeader_navItem" target="_blank">
                    <icon-base name="icon/instagram" class="fill-ft-light" :width="20" /> <span class="d-none ml-10 d-block@s">Cosmoz sur Instagram</span>
                </a>

                <a href="https://www.meetup.com/fr-FR/pro/gatherings" class="BlogHeader_navItem" target="_blank">
                    <icon-base name="icon/meetup" class="fill-ft-light" :width="25" /> <span class="d-none ml-10 d-block@s">Rejoindre notre Meetup</span>
                </a>
            </div>

            <div class="BlogHeader_burger" @click="isOpen = !isOpen">
                <fa icon="far fa-bars" v-if="!isOpen" />
                <fa icon="far fa-times" v-else />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogHeader',
    props: {
    },
    data: () => ({
        isOpen: false
    })
}
</script>

<style lang="scss" scoped>
    .BlogHeader {
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 90;
        color: var(--color-ft-light);
    }

    .BlogHeader_wrapper {
        height: 65px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
    }

    .BlogHeader_nav {
        display: flex;
        align-items: center;
        font: var(--ft-m-medium);
        line-height: 1;
    }

    .BlogHeader_burger {
        width: 45px;
        height: 45px;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 22px;
    }

    .BlogHeader_navItem {
        font: var(--ft-s);
        color: var(--color-ft-light);
        line-height: 1;
        display: flex;
        align-items: center;
        
        & + & {
            margin-left: 20px;
        }
    }

    .BlogHeader_logo {

        .tape {
            font: var(--ft-title-2xs);
            transform: rotate(-2deg);
        }
    }

    @include breakpoint-s {
        .BlogHeader_burger {
            display: flex;
        }

        .BlogHeader_logo {

            &::before {
                display: none;
            }
        }

        .BlogHeader_nav {
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

        .BlogHeader_wrapper {
            padding: 0 10px 0 16px;
        }
            
        .BlogHeader_navItem {
            display: flex;
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

        .BlogHeader.is-open {

            .BlogHeader_nav {
                display: block;
            }
        }
    }
</style>