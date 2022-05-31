<template>
    <div class="Nav bg-bg-strong br-s p-sticky" style="--offset: 40px;">
        <div class="Nav_cat" v-for="(cat, i) in items" :key="i">
            
            <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

            <nuxt-link v-for="item in cat.children" class="Nav_item" :to="localePath(item.to)" :key="item.label">
                <fa :icon="`far fa-${item.fa}`" /> {{ item.label }}
            </nuxt-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageConstNav',
    props: {
        slug: { type: String }
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
                    { label: `annonces`, fa: 'hashtag', to: { name: 'c-slug-feed', params: { slug: this.slug } } },
                    { label: `général`, fa: 'hashtag', to: { name: 'c-slug-feed', params: { slug: this.slug } } },
                    { label: `détente`, fa: 'hashtag', to: { name: 'c-slug-feed', params: { slug: this.slug } } },
                    { label: `entraide`, fa: 'hashtag', to: { name: 'c-slug-feed', params: { slug: this.slug } } },
                ]
            }
        ]
    }
}
</script>

<style lang="scss" scoped>
    .Nav {
        padding: 15px;
    }
    
    .Nav_cat {

        & + & {
            margin-top: 20px;
        }
    }

    .Nav_item {
        font: var(--ft-title-3xs);
        line-height: 1;
        cursor: pointer;
        color: var(--color-ft-light);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;

        display: block;
        padding: 10px;

        svg {
            margin-right: 5px;
        }

        &:hover,
        &.is-active-exact {
            background-color: var(--color-bg);
        }
    }
</style>