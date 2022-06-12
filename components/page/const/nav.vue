<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <div>
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero})`}" v-if="!isHome">
                <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :logo="logo" />
            </div>

            <div class="Nav_content">
                <div class="Nav_cat" v-for="(cat, i) in items.filter(c => !c.disabled)" :key="i">
                    <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

                    <div v-for="item in cat.children.filter(c => !c.disabled)" :key="item.label">
                        <nuxt-link class="Nav_item ellipsis-1 ellipsis-break" :class="{ 'is-parent': item.isParent }" :to="localePath(item.to)">
                            <fa :icon="`far fa-${item.fa}`" fixed-width /> {{ item.label }}
                        </nuxt-link>

                        <div class="Nav_sub" v-for="sub in (item.children ? item.children : []).filter(c => !c.disabled)" :key="sub.label">
                            <fa icon="far fa-corner" flip="both" />
                            <nuxt-link class="Nav_item Nav_item--sub ellipsis-1 ellipsis-break" :to="localePath(sub.to)">{{ sub.label }}</nuxt-link>
                        </div>
                    </div>
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
    async fetch () {
        if (this.user) {
            await this.$store.dispatch('gathering/softFetch', this.user.gatherings.map(g => g._id))
        }
    },
    props: {
        _id: { type: String },
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
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            return this.user ? this.$store.getters['gathering/find']({
                constellation: this._id,
                sort: { date: 'desc' }
            }) : []
        },
        isAdmin () { return this.user ? this.user.role == 'admin' || this.admins.includes(this.user._id) : false},
        isMember () { return this.user && this.members.includes(this.user._id) },
        attended () {
            return this.user ? this.user.gatherings.filter(g => g.status == 'attending' || g.status == 'confirmed').map(g => g._id) : []
        },
        events () {
            return this.gatherings.filter(g => !g.isPast).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: this.attended.includes(g._id) ? 'calendar-check' : 'calendar'
            }))
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast && this.attended.includes(g._id)).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: 'hashtag'
            }))
        },
        items () {
            return [
                {
                    children: [
                        { label: `Page d'accueil`, isParent: true, fa: 'home', to: { name: 'c-slug', params: { slug: this.slug } } }
                    ]
                }, 
                {
                    label: `Événements à venir`,
                    disabled: this.events.length <= 0,
                    children: this.events
                },
                {
                    label: `Événements passés`,
                    disabled: this.pastEvents.length <= 0,
                    children: this.pastEvents
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
        font: var(--ft-m);
        line-height: 0.6;
        cursor: pointer;
        color: var(--color-ft-weak);
        text-decoration-color: var(--color-ft-xweak);
        border-radius: 5px;
        transition: all 100ms ease;
        overflow: hidden;
        white-space: nowrap;

        display: block;
        padding: 14px 10px 10px 8px;

        svg {
            margin-right: 3px;
            margin-top: -4px;
        }

        &:hover {
            background-color: var(--color-bg);
        }

        &.is-active:not(.is-parent),
        &.is-active-exact.is-parent {
            color: var(--color-ft-light);
            background-color: var(--color-bg-weak);
        }
    }

    .Nav_sub {
        display: flex;
        align-items: center;
        margin-left: 20px;
        color: var(--color-ft-xweak);
    }

    .Nav_item--sub {
        flex-grow: 1;
        padding: 10px;
        margin-left: 5px;
        line-height: 1;
    }
</style>