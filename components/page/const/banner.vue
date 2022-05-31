<template>
    <div class="ConstBanner" :class="{ 'ConstBanner--min': min }">
        <div class="ConstBanner_cover outflow@s" :style="{ backgroundImage: `url(${hero})` }">
            <quick-menu
                class="ConstBanner_menu"
                :modifiers="['strong']"
                :items="[
                    { label: `Copier l'ID`, fa: 'hashtag', action: () => $copy(_id) }
                ]"
                v-if="!min"
            />
        </div>

        <div class="ConstBanner_sub bg-bg-weak outflow@s">
            <div class="d-flex fxa-center">
                <orga-icon :modifiers="min ? ['s'] : ($smallerThan('s') ? ['l'] : ['xl'])" :slug="slug" :name="name" :logo="logo" />

                <div class="ml-10">
                    <h1 class="ConstBanner_title ellipsis-1">{{ name }}</h1>
                    <h2 class="ft-m ft-s@s" v-if="!min">{{ intro }}</h2>
                </div>
            </div>
            <div class="d-flex fxa-center ml-20 ml-0@s fx-reverse@s pv-15@s mt-15@s br-s bg-bg-strong@s" v-if="!min">
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
        logo: { type: String },
        min: { type: Boolean, default: false }
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
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .ConstBanner_title {
        font: var(--ft-title-xs);
    }

    .ConstBanner--min {

        .ConstBanner_cover {

            &::before {
                @include ratio(0);
            }
        }

        .ConstBanner_sub {
            padding: 10px 15px 10px 10px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
        }

        .ConstBanner_title {
            font: var(--ft-title-2xs);
            word-break: break-all;
        }
    }

    @include breakpoint-s {
        .ConstBanner_sub {
            display: block;
        }
    }
</style>