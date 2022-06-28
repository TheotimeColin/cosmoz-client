<template>
    <div class="Nav bg-bg-strong" :class="{ 'is-absolute': isAbsolute }" style="--offset: 40px;">
        <div>
            <div class="Nav_cover bg-cover-25" :style="{ '--background': `url(${hero ? hero : $bg.night })`}" v-if="!isHome">
                <div class="fx-grow">
                    <const-icon :modifiers="['m']" :slug="slug" :display-name="true" :name="name" :type="type" :logo="logo" />
                </div>

                <quick-menu
                    class="ml-10"
                    :button="{ modifiers: ['xweak'] }"
                    :items="[
                        { fa: 'user-astronaut', to: { name: 'c-slug-members', params: { slug } }, label: `Liste des membres` },
                        
                        { fa: 'calendar', to: { name: 'c-slug-manage-events', params: { slug} }, label: `Gestion des événements`, disabled: !$isConsteOrga || type != 'community' },

                        
                        { fa: 'crown', to: { name: 'c-slug-admin', params: { slug} }, label: `Administration`, disabled: !$isConsteAdmin },


                        { fa: 'arrow-right-from-bracket', label: `Quitter ce groupe`, disabled: !$isConsteMember || $isConsteAdmin, action: onLeave },
                    ]"
                />
            </div>

            <div class="Nav_content">
                <nav-list :items="items" />
            </div>
        </div>

        <div class="Nav_footer">            
            <div class="p-15 bg-cosmoz" v-if="!user">
                <p class="ft-title-2xs mb-5">Devenir membre</p>
                <p class="ft-s mb-15">Rejoins la communauté et débloque toutes les sections !</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="sparkles" @click="$store.commit('page/register', 'g-join')">Rejoindre le groupe</button-base>
            </div>
            <div class="p-15 bg-bg-weak" v-else-if="$isConsteFollower">
                <p class="ft-title-2xs mb-15">Demande envoyée</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="cog" :to="{ name: 'c-slug-rejoindre', params: { slug } }">Gérer ma demande</button-base>
            </div>
            <div class="p-15 bg-cosmoz" v-else-if="!$isConsteMember">
                <p class="ft-title-2xs mb-5">Devenir membre</p>
                <p class="ft-s mb-15">Rejoins la communauté et débloque toutes les sections !</p>

                <button-base :modifiers="['full', 's', 'light']" icon-before="sparkles" :to="{ name: 'c-slug-rejoindre', params: { slug } }">Faire la demande</button-base>
            </div>
        </div>
    </div>
</template>

<script>
import Permissions from '@/mixins/permissions'

export default {
    name: 'PageConstNav',
    mixins: [ Permissions ],
    async fetch () {
        await this.$store.dispatch('gathering/softFetch', this.gatherings)
    },
    props: {
        _id: { type: String },
        slug: { type: String },
        hero: { type: String },
        type: { type: String },
        name: { type: String },
        logo: { type: Object },
        gatherings: { type: Array, default: () => [] },
        followers: { type: Array, default: () => [] },
        members: { type: Array, default: () => [] },
        admins: { type: Array, default: () => [] },
        organizers: { type: Array, default: () => [] },
        isHome: { type: Boolean, default: false },
        isAbsolute: { type: Boolean, default: false }
    },
    computed: {
        
        gatheringsData () {
            return this.$store.getters['gathering/find']({
                constellation: this._id,
                status: 'active',
                sort: { date: 'desc' }
            })
        },
        events () {
            return this.gatheringsData.filter(g => !g.isPast).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: g.isAttending ? 'calendar-check' : 'calendar'
            }))
        },
        pastEvents () {
            return this.gatheringsData.filter(g => g.isPast && g.isAttending && !g.isExpired).map(g => ({
                label: g.title, to: { name: 'c-slug-events-eventId', params: { slug: this.slug, eventId: g.id } }, fa: 'calendar-heart', hasAttended: g.isAttending
            }))
        },
        items () {
            return [
                {
                    label: `Activité`,
                    isParent: true,
                    fa: 'home',
                    to: { name: 'c-slug-feed', params: { slug: this.slug } }
                },
                {
                    label: `Discussions`,
                    fa: 'comments',
                    disabled: !this.user,
                    to: { name: 'c-slug-discussions', params: { slug: this.slug } }
                },
                {
                    label: `Événements`,
                    fa: 'calendar',
                    to: { name: 'c-slug-events', params: { slug: this.slug } },
                    number: this.events.length,
                    disabled: this.type == 'group',
                    children: [ ...this.events.slice(0, 3), ...this.pastEvents ]
                },
                {
                    label: `Sorties`,
                    fa: 'party-horn',
                    to: { name: 'c-slug-hangouts', params: { slug: this.slug } }
                },
                {
                    label: `Membres`,
                    fa: 'users',
                    to: { name: 'c-slug-members', params: { slug: this.slug } },
                    disabled: this.type == 'community'
                },
            ]
        }
    },
    methods: {
        onLeave () {
            this.$store.commit('page/popin', { confirm: {
                text: 'Veux-tu vraiment quitter ce groupe ?',
                confirm: {
                    text: 'Quitter le groupe',
                    modifiers: ['error'],
                    action: () => this.$store.dispatch('constellation/leave', this._id)
                }
            } })
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
        min-height: 100px;

        &::after {
            content: "";
            @include ratio(33);
        }
    }
</style>