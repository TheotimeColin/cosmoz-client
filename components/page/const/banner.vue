<template>
    <div class="ConstBanner" :class="{ 'ConstBanner--min': min, 'ConstBanner--event': isEvent }">
        <div class="ConstBanner_cover" :style="{ backgroundImage: `url(${hero})` }"></div>

        <div class="ConstBanner_sub">
            <div class="d-flex fxa-center">
                <const-icon :modifiers="min ? ['s'] : ($smallerThan('s') ? ['l'] : ['xl'])" :slug="slug" :logo="logo" v-show="!min" />
        
                <div class="ml-15">
                    <div class="ConstBanner_title ellipsis-1">
                        <!-- <fa :icon="`far fa-${fa ? fa : ''}`" class="mr-5" v-if="fa" /> -->

                        {{ subtitle ? subtitle : '' }}
                    </div>
                    
                    <h2 class="ft-m ft-s@s n-mt-3" v-if="!min">{{ intro }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstBanner',
    props: {
        _id: { type: String },
        slug: { type: String },
        hero: { type: String },
        name: { type: String },
        intro: { type: String },
        logo: { type: Object },
        isEvent: { type: Boolean, default: false },
        min: { type: Boolean, default: false }
    },
    computed: {
        
        subtitle () { return this.$store.state.page.subtitle },
        fa () { return this.$store.state.page.fa },
    }
}
</script>

<style lang="scss" scoped>
    .ConstBanner_cover {
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        position: relative;

        &::before {
            content: "";
            display: block;
            transition: all 300ms ease;
            transition-delay: 0ms;
            @include ratio(20);
        }
    }

    .ConstBanner_menu {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .ConstBanner_sub {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px;
        min-height: 65px;
        background: var(--color-bg-strong);
        transition: all 200ms ease;
    }

    .ConstBanner_title {
        font: var(--ft-title-m);
    }

    .ConstBanner--min {

        .ConstBanner_cover {

            &::before {
                @include ratio(0);
            }
        }

        .ConstBanner_sub {
            padding: 10px;
            min-height: 55px;
            background: var(--color-bg-xstrong);
        }

        .ConstBanner_title {
            font: var(--ft-title-2xs);
            word-break: break-all;
        }
    }

    .ConstBanner--event {

        .ConstBanner_sub {
            border-radius: 0;
        }
    }

    @include breakpoint-s {
        .ConstBanner_sub {
            display: block;
        }
    }
</style>