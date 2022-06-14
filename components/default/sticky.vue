<template>
    <div class="Sticky" :class="{ 'is-active': isActive, 'is-panning': isPanning }" :style="{ transform: `translateY(${100 * translate}%)` }">
        <div class="Sticky_wrapper">
            <const-icon class="Sticky_current" :no-link="true" v-bind="selectConst" @click.native="$emit('open')" v-if="selectConst" />
            <div class="Sticky_current round ft-xs bg-cosmoz" @click="$emit('open')" v-else>
                <fa icon="far fa-home" />
            </div>

            <component :is="item.to ? 'nuxt-link' : 'div'" class="Sticky_item" :to="localePath(item.to)" v-for="item in items" :key="item.fa">
                <fa :icon="`far fa-${item.fa}`" />

                <p class="Sticky_label">{{ item.label ? item.label : '' }}</p>
            </component>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        translate: { type: Number },
        isPanning: { type: Boolean, default: false },
        isActive: { type: Boolean, default: false }
    },
    computed: {
        selectConst () {
            return this.$route.params.slug ? this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            }) : null
        },
        items () {
            return this.selectConst ? [
                { label: 'Accueil', fa: 'home', to: { name: 'c-slug', params: { slug: this.selectConst.slug }} },
                { label: 'Événements',  fa: 'calendar-star', to: { name: 'c-slug-events', params: { slug: this.selectConst.slug }} },
                { label: 'Sorties',  fa: 'hand-wave', to: { name: 'c-slug-hangouts', params: { slug: this.selectConst.slug }} },
                { label: 'Discussions',  fa: 'messages', to: { name: 'c-slug-channel-id', params: { slug: this.selectConst.slug, id: 'general' }} }
            ] : [
                { label: 'Actualité', fa: 'home', to: { name: 'feed' } },
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
    padding: 0 10px;
    justify-content: space-between;
}

.Sticky_item {
    width: 45px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-ft-weak);
    position: relative;
    transition: all 150ms ease;

    &.is-active-exact {
        height: 45px;
        color: var(--color-ft-light);

        .Sticky_label {
            opacity: 1;
        }
    }
}

.Sticky_current {
    align-self: center;
}

.Sticky_label {
    opacity: 0;
    pointer-events: none;
    font: var(--ft-2xs);
    font-size: 10px;
    position: absolute;
    bottom: -5px;
    white-space: nowrap;
}

@include breakpoint-s {

    .Sticky {
        display: block;
    }
}
</style>