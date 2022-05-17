<template>
    <component
        :is="to ? 'nuxt-link' : (tag ? tag : (href || link || (node && node.attrs.link) ? 'a' : 'div'))"
        class="LinkBase"
        :class="[ $modifiers, { 'is-invert': invert } ]"
        :target="target"
        :href="node && node.attrs.link ? node.attrs.link : (link ? link : href)"
        :to="to ? localePath(to) : null"
        v-bind="attrs"
        @click="$emit('click')"
    >
        <div class="LinkBase_content">
            <fa class="mr-5" :icon="`far fa-${iconBefore}`" v-if="iconBefore" />

            <slot></slot>

            <fa class="ml-5" :icon="`far fa-${iconAfter}`" v-if="iconAfter" />
        </div>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'
export default {
    name: 'LinkBase',
    mixins: [ ModifiersMixin ],
    props: {
        tag: { type: [String, Boolean], default: false },
        iconAfter: { type: [ String, Boolean ], default: false },
        iconBefore: { type: [ String, Boolean ], default: false },
        invert: { type: Boolean, default: false },
        target: { type: String, defaut: '_self' },
        node: { type: Object, default: () => {} },
        to: { type: [Object, String] },
        link: { type: [ String ], default: '' },
        href: { type: [ String ], default: '' },
        attrs: { type: Object, default: () => {} },
    }
}
</script>

<style lang="scss" scoped>
.LinkBase {
    font: var(--ft-s);
    line-height: 1;
    display: inline-block;
    cursor: pointer;
    padding: 0;
    color: var(--color-ft-light);
    text-underline-offset: 0.085rem;
    text-decoration: underline;

    &:hover {
        text-decoration: none;
    }

    &:active {
        opacity: 0.5;
        text-decoration: none;
    }

    &.is-invert {
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}

.LinkBase_content {
    position: relative;
}

.LinkBase--s {
    font: var(--ft-xs);
    line-height: 1;

    &::before {
        bottom: -4px;
    }
}

.LinkBase--current {
    color: var(--color-current);

    &::before {
        background-color: var(--color-current);
    }
}
</style>