<template>
    <div class="Sticky" :class="{ 'is-active': isActive || ($appMeta && $appMeta.isPanel), 'is-panning': isPanning }" :style="{ transform: `translateY(${100 * translate}%)` }">
        <div class="Sticky_wrapper">
            <const-icon class="Sticky_current" :no-link="true" v-bind="selectConst" @click.native="$emit('open')" v-if="selectConst" />
            <div class="Sticky_current round ft-xs bg-cosmoz" @click="$emit('open')" v-else>
                <fa icon="far fa-home" />
            </div>

            <default-sticky-item v-for="item in items" v-bind="item" :key="item.fa" />
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
                { label: 'Activité', fa: 'message-lines', to: { name: 'c-slug-feed', params: { slug: this.selectConst.slug }} },
                { label: 'Événements',  fa: 'calendar-star', to: { name: 'c-slug-events', params: { slug: this.selectConst.slug }} },
                { label: 'Sorties',  fa: 'hand-wave', to: { name: 'c-slug-hangouts', params: { slug: this.selectConst.slug }} },
                { label: 'Discussions',  fa: 'comments', to: { name: 'c-slug-discussions', params: { slug: this.selectConst.slug }} }
            ] : [
                { label: 'Mon activité', fa: 'home', to: { name: 'feed' } },
                { label: 'Mon agenda', fa: 'calendar', to: { name: 'agenda' } },
                { label: 'Explorer', fa: 'compass', to: { name: 'explore' } },
                { label: 'Envies', fa: 'star', to: { name: 'constellation' } }
            ]
        }
    }
}
</script>

<style lang="scss" scoped>
.Sticky {
    position: fixed;
    width: 100%;
    z-index: 20;
    bottom: 0;
    background-color: var(--color-bg-strong);
    transform: translate(0%);
    transition: all 200ms ease;
    display: none;
    overflow: hidden;

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
    height: 60px;
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