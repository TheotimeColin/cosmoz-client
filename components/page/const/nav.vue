<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <transition name="fade">
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero})`}" v-if="!isHome">
                <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :logo="logo" />
            </div>
        </transition>

        <div class="Nav_content">
            <div class="Nav_cat" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
                <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

                <nuxt-link v-for="item in cat.children.filter(c => !c.disabled)" class="Nav_item ellipsis-1 ellipsis-break" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)" :key="item.label">
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
        admins: { type: Array, default: () => [] },
        organizers: { type: Array, default: () => [] },
        isHome: { type: Boolean, default: false },
        isAbsolute: { type: Boolean, default: false }
    },
    data: () => ({
        items: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
    },
    created () {
        this.items = [
            {
                children: [
                    { label: `Page d'accueil`, isParent: true, fa: 'home', to: { name: 'c-slug', params: { slug: this.slug } } },
                    { label: `Rencontres prévues`, fa: 'calendar', to: { name: 'c-slug-events', params: { slug: this.slug } } }
                ]
            }, {
                label: `Organisateurs`,
                disabled: (this.user && this.user.role != 'admin') && !this.organizers.includes(this.user._id) && !this.admins.includes(this.user._id),
                children: [
                    { label: `Gestion des rencontres`, isParent: true,fa: 'calendar-pen', to: { name: 'c-slug-manage-events', params: { slug: this.slug } } },
                    { label: `Paramètres`, isParent: true, fa: 'cog', to: { name: 'c-slug-settings', params: { slug: this.slug } }, disabled: (this.user && this.user.role != 'admin') && !this.admins.includes(this.user._id) },
                ]
            },
            // {
            //     label: `Sorties`,
            //     children: [
            //         { label: `Rejoindre une sortie`, fa: 'party-horn', to: { name: 'c-slug-hangouts', params: { slug: this.slug } } },
            //         { label: `Idées de sorties`, fa: 'lightbulb', to: { name: 'c-slug-hangouts', params: { slug: this.slug } } }
            //     ]
            // },
            {
                label: `Discussions`,
                children: [
                    { label: `général`, fa: 'hashtag', to: { name: 'c-slug-channel-id', params: { slug: this.slug, id: 'general' } } },
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
        font-size: 15px;
        line-height: 1;
        cursor: pointer;
        color: var(--color-ft-light);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;
        overflow: hidden;
        white-space: nowrap;

        display: block;
        padding: 10px 10px;

        svg {
            margin-right: 8px;
        }

        &:hover {
            background-color: var(--color-bg);
        }

        &.is-active:not(.is-parent),
        &.is-active-exact.is-parent {
            background-color: var(--color-bg-weak);
        }
    }
</style>