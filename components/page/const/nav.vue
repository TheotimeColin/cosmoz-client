<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <div>
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero})`}" v-if="!isHome">
                <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :logo="logo" />
            </div>

            <div class="Nav_content">
                <div class="Nav_cat" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
                    <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

                    <nuxt-link v-for="item in cat.children.filter(c => !c.disabled)" class="Nav_item ellipsis-1 ellipsis-break" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)" :key="item.label">
                        <fa :icon="`far fa-${item.fa}`" /> {{ item.label }}
                    </nuxt-link>
                </div>
            </div>
        </div>

        <div class="Nav_footer">
            <div class="p-10">
                <div class="Nav_cat">
                    <nuxt-link class="Nav_item ellipsis-1 ellipsis-break" :to="localePath({ name: 'c-slug-settings', params: { slug } })" v-if="isMember">
                        <fa icon="far fa-cog" /> Paramètres
                    </nuxt-link>

                    <nuxt-link class="Nav_item ellipsis-1 ellipsis-break" :to="localePath({ name: 'c-slug-admin', params: { slug } })" v-if="isAdmin">
                        <fa icon="far fa-crown" /> Administration
                    </nuxt-link>
                </div>
            </div>

            <div class="p-15 bg-cosmoz" v-if="followers.includes(user._id)">
                <p class="ft-title-2xs mb-5">Demande en cours</p>
                <p class="ft-s mb-15">Ta demande a été envoyée et elle est en attente. Un peu de patience !</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="sparkles" :to="{ name: 'c-slug-rejoindre', params: { slug } }">Gérer ma demande</button-base>
            </div>
            <div class="p-15 bg-cosmoz" v-else-if="!members.includes(user._id)">
                <p class="ft-title-2xs mb-5">Devenir membre</p>
                <p class="ft-s mb-15">Rejoins la communauté et débloque toutes les sections !</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="sparkles" :to="{ name: 'c-slug-rejoindre', params: { slug } }">Faire la demande</button-base>
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
        followers: { type: Array, default: () => [] },
        members: { type: Array, default: () => [] },
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
        isAdmin () { return this.user ? this.user.role == 'admin' || this.admins.includes(this.user._id) : false},
        isMember () { return this.user && this.members.includes(this.user._id) }
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
                    { label: `Gestion des rencontres`, isParent: true,fa: 'calendar-pen', to: { name: 'c-slug-manage-events', params: { slug: this.slug } } }
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 150ms ease;
        height: 100%;

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

    .Nav_footer {

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