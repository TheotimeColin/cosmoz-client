<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <div>
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero})`}" v-if="!isHome">
                <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :logo="logo" />
            </div>

            <div class="Nav_content">
                <nav-list :items="items" />
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
            
            <div class="p-15 bg-cosmoz" v-if="!user">
                <p class="ft-title-2xs mb-5">Devenir membre</p>
                <p class="ft-s mb-15">Rejoins la communauté et débloque toutes les sections !</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="sparkles" @click="$store.commit('page/register', 'g-join')">Rejoindre le groupe</button-base>
            </div>
            <div class="p-15 bg-cosmoz" v-else-if="followers.includes(user._id)">
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
            return this.$store.getters['gathering/find']({
                constellation: this._id,
                sort: { date: 'desc' }
            })
        },
        isAdmin () { return this.user ? this.user.role == 'admin' || this.admins.includes(this.user._id) : false},
        isMember () { return this.user && this.members.includes(this.user._id) },
        events () {
            return this.gatherings.filter(g => !g.isPast).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: g.isAttending ? 'calendar-check' : 'calendar'
            }))
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: 'hashtag', hasAttended: g.isAttending
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
                    label: `Sorties à venir`,
                    disabled: this.events.length <= 0,
                    children: [ ...this.events.slice(0, 3), {
                        label: 'Voir tout',
                        number: this.events.length,
                        isParent: true,
                        to: { name: 'c-slug-events', params: { slug: this.slug } }
                    }]
                },
                {
                    label: `Sorties passées`,
                    disabled: this.pastEvents.length <= 0,
                    children: [ ...this.pastEvents.filter(g => g.hasAttended).slice(0, 3), {
                        label: 'Voir tout',
                        number: this.pastEvents.length,
                        isParent: true,
                        to: { name: 'c-slug-events-past', params: { slug: this.slug } }
                    }]
                },
                {
                    label: `Discussions`,
                    disabled: !this.user,
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
</style>