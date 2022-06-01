<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <transition name="fade">
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero})`}" v-if="!isHome">
                <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :logo="logo" />
            </div>
        </transition>

        <div class="Nav_content">
            <div class="Nav_cat" v-for="(cat, i) in items" :key="i">
                <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

                <nuxt-link v-for="(item, j) in cat.children" class="Nav_item" :class="{ 'is-index': j == 0 }" :to="localePath(item.to)" :key="item.label">
                    <fa :icon="`far fa-${item.fa}`" /> {{ item.label }}
                </nuxt-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageConstNav',
    props: {
        slug: { type: String },
        hero: { type: String },
        name: { type: String },
        logo: { type: Object },
        isHome: { type: Boolean, default: false },
        isAbsolute: { type: Boolean, default: false }
    },
    data: () => ({
        items: []
    }),
    created () {
        this.items = [
            {
                children: [
                    { label: `Page d'accueil`, fa: 'home', to: { name: 'c-slug', params: { slug: this.slug } } },
                    { label: `Rencontres prévues`, fa: 'calendar', to: { name: 'c-slug-events', params: { slug: this.slug } } }
                ]
            }, {
                label: `Sorties`,
                children: [
                    { label: `Rejoindre une sortie`, fa: 'party-horn', to: { name: 'c-slug-hangouts', params: { slug: this.slug } } },
                    { label: `Idées de sorties`, fa: 'lightbulb', to: { name: 'c-slug-hangouts', params: { slug: this.slug } } }
                ]
            }, {
                label: `Discussions`,
                children: [
                    { label: `annonces`, fa: 'hashtag', to: { name: 'c-slug-channel-id', params: { slug: this.slug, id: 'annonces' } } },
                    { label: `général`, fa: 'hashtag', to: { name: 'c-slug-channel-id', params: { slug: this.slug, id: 'general' } } },
                    { label: `détente`, fa: 'hashtag', to: { name: 'c-slug-channel-id', params: { slug: this.slug, id: 'detente' } } },
                    { label: `entraide`, fa: 'hashtag', to: { name: 'c-slug-channel-id', params: { slug: this.slug, id: 'entraide' } } },
                ]
            }
        ]
    }
}
</script>

<style lang="scss" scoped>
    .Nav {
        transition: transform 150ms ease;

        &.is-absolute {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            z-index: 10;
            transform: translateX(-100%);

            
            &:hover {
                transform: translateX(0%);
            }

            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                right: -5px;
                height: 100%;
                width: 5px;
            }
        }
    }

    .Nav_content {
        padding: 15px;
    }

    .Nav_cover {
        background-size: cover;
        background-position: center;
        background-color: var(--color-bg-xstrong);
        display: flex;
        align-items: center;
        padding: 5px 15px;

        &::after {
            content: "";
            @include ratio(33);
        }
    }
    
    .Nav_cat {

        & + & {
            margin-top: 20px;
        }
    }

    .Nav_item {
        font: var(--ft-title-2xs);
        line-height: 1;
        cursor: pointer;
        color: var(--color-ft-light);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;

        display: block;
        padding: 12px 10px;

        svg {
            margin-right: 8px;
        }

        &:hover,
        &.is-active:not(.is-index),
        &.is-active-exact.is-index {
            background-color: var(--color-bg);
        }
    }
</style>