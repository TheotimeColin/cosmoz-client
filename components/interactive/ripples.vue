<template>
    <div class="Ripple" :class="[ { 'is-auto': auto }, $modifiers ]" :style="{ '--size': size + 'px', '--duration': duration + 'ms' }" @click="ripple">
        <div
            class="Ripple_item"
            v-for="ripple in ripples"
            :style="{ ...ripple }"
            :key="ripple.id"
        ></div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'Ripples',
    mixins: [ ModifiersMixin ],
    props: {
        auto: { type: Boolean, default: true },
        size: { type: Number, default: 100 }
    },
    data: () => ({
        ripples: []
    }),
    computed: {
        duration () {
            return 300
        }
    },
    methods: {
        ripple (e) {
            let id = Math.random()

            this.ripples = [ ...this.ripples, {
                id, left: e.offsetX + 'px', top: e.offsetY + 'px'
            } ]

            setTimeout(() => {
                this.ripples = this.ripples.filter(r => r.id !== id)
            }, this.duration)
        }
    }
}
</script>

<style lang="scss" scoped>

.Ripple {
    @include absolute-fill;
    pointer-events: none;
    overflow: hidden;

    &.is-auto {
        pointer-events: all;
        overflow: visible;
    }
}

.Ripple_item {
    width: var(--size);
    height: var(--size);
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    position: absolute;
    margin: calc(var(--size) / 2 * -1) 0 0 calc(var(--size) / 2 * -1);
    opacity: 1;
    pointer-events: none;
    transform: scale(0.25);
    animation: ripple var(--duration, 300ms) linear;
}

.Ripples--weak {

    .Ripple_item {
        background: rgba(255, 255, 255, 0.025);
    }
}
</style>