<template>
    <div
        class="Tooltip shadow"
        :class="[ ...$modifiers ]"
        :style="{ marginTop: top + 'px', marginLeft: left + 'px', transitionDelay: `${delay}ms` }"
    >
        <div class="Tooltip_loading" v-if="load">
            <fa :icon="`far fa-spinner-third`" class="spin" />
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'Tooltip',
    mixins: [ ModifiersMixin ],
    props: {
        tag: { type: String, default: 'span' },
        
        delay: { type: Number, default: 0 },
        top: { type: Number, default: 10 },
        load: { type: Boolean, default: false },
        left: { type: Number, default: 0 }
    }
}
</script>

<style lang="scss" scoped>
.Tooltip {
    font: var(--ft-m-medium);
    color: var(--color-ft-light);
    background-color: color-opacity('bg-2xstrong', -10%);
    backdrop-filter: blur(4px);
    pointer-events: none;
    transform-origin: center;
    transform: scale(0.98) translateY(3px);
    opacity: 0;
    padding: 10px 15px;
    border-radius: 5px;
    transition: all 150ms ease;
    pointer-events: none;
    
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
}

.is-tooltip-active .Tooltip,
.Tooltip.is-active {
    opacity: 1;
    transform: scale(1) translateY(0);
    pointer-events: all;
}

@include breakpoint-s {

    .Tooltip {
        display: none;
    }
}
</style>