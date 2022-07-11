<template>
    <div class="Sticky" :class="{ 'is-active': isActive || ($appMeta && $appMeta.isPanel), 'is-panning': isPanning }" :style="{ transform: `translateY(${100 * translate}%)` }">
        <div class="fx-center p-15 bg-cosmoz" v-if="selectConst && !selectConst.isMember">
            <div class="mr-10" v-if="selectConst.isFollower">
                <p class="ft-title-2xs ellipsis-1">Demande envoyée</p>
            </div>
            <div class="mr-10" v-else>
                <p class="ft-title-2xs ellipsis-1">Rejoins {{ selectConst.name }}</p>
                <p class="ft-s mt-3" v-if="!selectConst.isFollower">Découvre les membres et le contenu publié par la communauté.</p>
            </div>
            
            <link-base :to="{ name: 'c-slug-rejoindre', params: { slug: selectConst.slug } }" v-if="selectConst.isFollower">Voir la demande</link-base>
            <button-base :to="{ name: 'c-slug-rejoindre', params: { slug: selectConst.slug } }" :modifiers="['round', 'light']" icon-before="arrow-right" v-else />
        </div>
        <div>
            <div class="Sticky_wrapper">
                <const-icon class="Sticky_current" :no-link="true" v-bind="selectConst" @click.native="onOpen" v-if="selectConst" />

                <app-sticky-item v-for="item in items.filter(i => !i.disabled)" v-bind="item" :key="item.fa" />
            </div>
        </div>
    </div>
</template>

<script>
import { getMeta } from '@/utils/meta'

export default {
    props: {
        translate: { type: Number },
        isPanning: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
    },
    computed: {
        $appMeta () { return getMeta(this.$route, this.$store) },
        selectConst () {
            return this.$route.params.slug ? this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            }) : null
        },
        items () {
            return this.selectConst ? [
                {
                    label: 'Activité', fa: 'home',
                    to: { name: 'c-slug-feed', params: { slug: this.selectConst.slug }}
                }, {
                    label: 'Événements', disabled: this.selectConst.type == 'group', fa: 'calendar-star',
                    to: { name: 'c-slug-events', params: { slug: this.selectConst.slug }}
                }, {
                    label: 'Sorties',  fa: 'hand-wave',
                    to: { name: 'c-slug-hangouts', params: { slug: this.selectConst.slug }}
                }, {
                    label: 'Discussions',  fa: 'comments',
                    to: { name: 'c-slug-discussions', params: { slug: this.selectConst.slug }}
                }, {
                    label: 'Membres', disabled: this.selectConst.type == 'community', fa: 'users',
                    to: { name: 'c-slug-members', params: { slug: this.selectConst.slug }}
                },
            ] : [
                { label: 'Menu', fa: 'bars', onClick: this.onOpen },
                { label: 'Mon activité', fa: 'home', to: { name: 'feed' } },
                { label: 'Mon agenda', fa: 'calendar', to: { name: 'agenda' } },
                { label: 'Mes constellations', fa: 'sparkles', to: { name: 'constellation' } },
                { label: 'Explorer', fa: 'compass', to: { name: 'explore' } },
            ]
        }
    },
    methods: {
        onOpen() {
            this.$emit('open')

            this.$store.commit('page/toggleNotifs', false)
        }
    }
}
</script>

<style lang="scss">
    :root {
        --sticky-height: 0px;
    }

    @include breakpoint-s {
        
        :root {
            --sticky-height: 60px;
        }
    }
</style>

<style lang="scss" scoped>
.Sticky {
    position: fixed;
    width: 100%;
    z-index: 20;
    bottom: 0;
    background-color: var(--color-bg-xstrong);
    transform: translate(0%);
    transition: all 200ms ease;
    display: none;
    overflow: hidden;
    box-shadow: 0 0 10px 0 color-opacity('bg-xstrong', -50%);

    &.is-active {
        transform: translateY(100%) !important;
    }

    &.is-panning {
        transition: none;
    }
}

.Sticky_wrapper {
    font-size: 18px;
    display: flex;
    height: var(--sticky-height);
    padding: 0 15px 0 10px;
    justify-content: space-between;
}

.Sticky_current {
    align-self: center;
}

@include breakpoint-s {

    .Sticky {
        display: block;
    }
}
</style>