<template>
    <div class="Sticky" :class="{ 'is-active': isActive || selectConst, 'is-panning': isPanning }" :style="{ transform: `translateY(${100 * translate}%)` }">
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
                <component
                    :is="item.add ? 'app-add' : item.user ? 'app-user' : 'app-sticky-item'"
                    :class="{ 'Sticky_add': item.add }"
                    v-for="item in items.filter(i => !i.disabled)"
                    v-bind="item"
                    :key="item.fa"
                />
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
                // {
                //     label: 'Activité', fa: 'home',
                //     to: { name: 'c-slug', params: { slug: this.selectConst.slug }}
                // }, {
                //     label: 'Événements', disabled: this.selectConst.type == 'group', fa: 'calendar-star',
                //     to: { name: 'c-slug-events', params: { slug: this.selectConst.slug }}
                // }, { add: true }, {
                //     label: 'Sorties',  fa: 'hand-wave',
                //     to: { name: 'c-slug-hangouts', params: { slug: this.selectConst.slug }}
                // }, {
                //     label: 'Discussions',  fa: 'comments',
                //     to: { name: 'c-slug-discussions', params: { slug: this.selectConst.slug }}
                // }, {
                //     label: 'Membres', disabled: this.selectConst.type == 'community', fa: 'users',
                //     to: { name: 'c-slug-members', params: { slug: this.selectConst.slug }}
                // },
            ] : [
                { label: 'Mon activité', fa: 'home', to: { name: 'feed' } },
                { label: 'Mon agenda', fa: 'calendar', to: { name: 'agenda' } },
                { add: true },
                { label: 'Explorer', fa: 'compass', to: { name: 'explore' } },
                { user: true },
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
    z-index: 90;
    bottom: 0;
    background-color: color-opacity('bg', -10%);
    backdrop-filter: blur(12px);
    transform: translate(0%);
    transition: all 200ms ease;
    display: none;
    @include shadow;

    &.is-active {
        transform: translateY(100%) !important;

        .Sticky_add {
            transform: scale(0);
        }
    }

    &.is-panning {
        transition: none;
    }
}

.Sticky_add {
    transition: all 200ms ease;
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