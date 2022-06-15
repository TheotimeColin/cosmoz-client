<template>
    <component :is="to ? 'nuxt-link' : 'div'" class="Sticky_item" :to="localePath(to)">
        <ripples />
        <fa :icon="`far fa-${fa}`" />
        <p class="Sticky_label">{{ label ? label : '' }}</p>
    </component>
</template>

<script>
export default {
    props: {
        to: { type: Object },
        label: { type: String },
        fa: { type: String },
    }
}
</script>

<style lang="scss" scoped>
.Sticky_item {
    width: 60px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--color-ft-weak);
    position: relative;
    transition: all 150ms ease;
    -webkit-tap-highlight-color: transparent;

    &:active {
        outline: none;
    }
    
    .Sticky_label, svg {
        transition: all 150ms ease;
        pointer-events: none;
    }

    &.is-active-exact {
        color: var(--color-ft-light);

        svg {
            transform: translateY(-8px);
        }

        .Sticky_label {
            opacity: 1;
            transform: translateY(0);
        }
    }
}

.Sticky_label {
    opacity: 0;
    pointer-events: none;
    font: var(--ft-2xs);
    font-size: 10px;
    position: absolute;
    bottom: 10px;
    transform: translateY(-8px);
    white-space: nowrap;
}

</style>