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
            {{ text }}

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
        text: { type: String },
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
    font: var(--ft-title-3xs);
    line-height: 1.6;
    display: inline-block;
    cursor: pointer;
    padding: 0;
    color: var(--color-ft-light);
    text-underline-offset: 0.2rem;
    text-decoration: underline;
    text-decoration-color: var(--color-ft-xweak);
    text-decoration-thickness: 2px;

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
    font: var(--ft-title-4xs);
}

.LinkBase--l {
    font: var(--ft-title-2xs);
}

.LinkBase--weak {
    color: var(--color-ft-weak);

    &:hover {
        color: var(--color-ft-light);
        text-decoration: underline;
    }
}
</style>