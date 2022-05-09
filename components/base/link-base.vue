<template>
    <component
        :is="to ? 'nuxt-link' : (tag ? tag : (href || link || (node && node.attrs.link) ? 'a' : 'div'))"
        class="LinkBase"
        :class="[ ...$modifiers ]"
        :target="target"
        :href="node && node.attrs.link ? node.attrs.link : (link ? link : href)"
        :to="to ? to : null"
        v-bind="attrs"
        @click="$emit('click')"
    >
        <div class="LinkBase_content">
            <i class="fal mr-5" :class="[`fa-${iconBefore}`]" v-if="iconBefore"></i>

            <slot></slot>

            <i class="fal ml-5" :class="[`fa-${iconAfter}`]" v-if="iconAfter"></i>
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
        target: { type: String, defaut: '_self' },
        node: { type: Object, default: () => {} },
        to: { type: Object, default: () => {} },
        link: { type: [ String ], default: '' },
        href: { type: [ String ], default: '' },
        attrs: { type: Object, default: () => {} },
    }
}
</script>