<template>
    <component :is="componentTag" class="ButtonBase"
        :class="[ $modifiers, (node ? node.attrs.class : []), { 'is-loading': loading, 'is-disabled': disabled, 'is-image': image } ]" :to="localePath(to)"
        :disabled="disabled || loading"
        v-bind="computedAttrs"
        v-on="$listeners"
    >
        <div class="G_cosmoz"></div>

        <div class="ButtonBase_content">
            <span class="ButtonBase_image" :style="{ backgroundImage: `url(${image})` }" v-if="image"></span>

            <span class="ButtonBase_iconBefore" v-if="iconBefore">
                <fa :icon="`far fa-${iconBefore}`" fixed-width />
            </span>
            <span class="ButtonBase_iconBefore ButtonBase_emoji" v-if="emojiBefore">
                {{ emojiBefore }}
            </span>

            <span class="ButtonBase_before" v-if="$slots.before">
                <slot name="before"></slot>
            </span>

            <span class="ButtonBase_text" v-if="text || subtitle || ($slots.default && $slots.default !== '')">
                {{ text ? $ellipsis(text, ellipsis) : '' }}

                <slot></slot>

                <div class="ButtonBase_subtitle" v-if="subtitle">{{ subtitle }}</div>
            </span>
            
            <span class="ButtonBase_after" v-if="$slots.after">
                <slot name="after"></slot>
            </span>

            <span class="ButtonBase_iconAfter" v-if="iconAfter">
                <fa :icon="`far fa-${iconAfter}`" fixed-width />
            </span>
            <span class="ButtonBase_iconAfter ButtonBase_emoji" v-if="emojiAfter">
                {{ emojiAfter }}
            </span>
        </div>

        <ripples v-show="!disabled" />

        <div class="ButtonBase_iconLoading">
            <fa :icon="`far fa-${iconLoading}`" />
        </div>

    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ButtonBase',
    mixins: [ ModifiersMixin ],
    props: {
        tag: { type: String },
        href: { type: String },
        link: { type: String },
        text: { type: [String, Number], default: '' },
        subtitle: { type: String },
        image: { type: String },
        ellipsis: { type: Number, default: 999 },
        notification: { type: Boolean },
        disabled: { type: Boolean, default: false },
        to: { type: [Object, Boolean], default: false },
        node: { type: Object, default: () => {} },
        emojiBefore: { type: String, default: '' },
        emojiAfter: { type: String, default: '' },
        iconBefore: { type: String, default: '' },
        iconAfter: { type: String, default: '' },
        loading: { type: Boolean, default: false },
        iconLoading: { type: String, default: 'spinner-third' },
        attrs: { type: Object, default: () => ({}) }
    },
    computed: {
        componentTag () {
            if (this.tag) return this.tag

            if (this.link || this.href) return 'a'
            if (this.to) return 'nuxt-link'

            return 'button'
        },
        computedAttrs () {
            return {
                href: this.$props.link ? this.$props.link : this.$props.href,
                ...this.$props.attrs,
                ...(this.$props.node ? this.$props.node.attrs : {})
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.ButtonBase {
    display: inline-flex;
    font: var(--ft-title-3xs);
    line-height: 1;
    color: var(--color-ft-light);
    background-color: var(--color-bg-xstrong);
    padding: 12px 20px;
    border-radius: 40px;
    transition: all 150ms ease;
    text-align: center;
    align-items: center;
    transform-origin: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    vertical-align: middle;
    box-shadow: 0 3px 10px 0 color-opacity('bg-2xstrong', -50%);

    cursor: pointer;

    &:active {
        background-color: var(--color-bg-light);
        color: var(--color-ft);
        transform: scale(0.99);
        box-shadow: 0 1px 4px 0 color-opacity('bg-2xstrong', -25%);
    }

    &:active {
        transform: scale(0.95) !important;
    }

    &.is-image {
        padding: 5px 15px 5px 5px;
    }
}

.G_cosmoz {
    opacity: 0;
}

.ButtonBase_image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    margin-right: 8px;
}

.ButtonBase_text {
    line-height: 1;
}

.ButtonBase_content {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    white-space: nowrap;
    position: relative;
    z-index: 2;
    pointer-events: none;
}

.ButtonBase_iconLoading {
    pointer-events: none;
    font-size: 150%;
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    line-height: 1;
    opacity: 0;
    animation: baseSpin 1000ms cubic-bezier(0.39, 0.32, 0.18, 0.87) 0s infinite;
}

.ButtonBase_emoji {
    font-family: 'Segoe UI Emoji';
    line-height: 1;
}

.ButtonBase_subtitle {
    font: var(--ft-s-medium);
    margin-top: 5px;
    line-height: 1.2;
    white-space: normal;
}

.ButtonBase_iconBefore + .ButtonBase_text,
.ButtonBase_text + .ButtonBase_iconAfter {
    margin-left: 8px;
}

.ButtonBase_iconBefore {
    pointer-events: none;
}

.ButtonBase_iconAfter {
    pointer-events: none;
}

@keyframes baseSpin {
    0% {
        transform: translate3d(-50%, -50%, 0) rotate(0deg);
    }

    100% {
        transform: translate3d(-50%, -50%, 0) rotate(360deg);
    }
}

/* MODIFIERS */

.ButtonBase--s {
    padding: 10px 15px;
    font: var(--ft-title-3xs);
    box-shadow: 0 2px 6px 0 color-opacity('bg-2xstrong', -75%);
    
    .ButtonBase_image {
        width: 30px;
        height: 30px;
        margin-right: 8px;
    }
}

.ButtonBase--xs {
    padding: 5px 10px;
    min-width: 39px;
    min-height: 39px;
    font: var(--ft-title-3xs);
}

.ButtonBase--2xs {
    padding: 3px 10px 3px 8px;
    min-width: 0px;
    min-height: 28px;
    font: var(--ft-title-3xs);
    font-size: 12px;

    .ButtonBase_emoji {
        font-size: 15px;
    }

    .ButtonBase_iconBefore + .ButtonBase_text,
    .ButtonBase_text + .ButtonBase_iconAfter {
        margin-left: 4px;
    }
}

.ButtonBase.is-loading {
    pointer-events: none;

    .ButtonBase_content {
        transform: scale(0.95);
        opacity: 0.5;
    }

    .ButtonBase_iconLoading {
        opacity: 1;
    }
}


.ButtonBase--strong {
    background-color: var(--color-bg-xstrong);
}

.ButtonBase--weak {
    background-color: var(--color-bg-weak);
    color: var(--color-ft-weak);
    border-color: transparent;

    &.is-active,
    &:active {
        color: var(--color-ft-light);
        background-color: var(--color-bg-strong);
    }
}

.ButtonBase--xweak {
    background-color: transparent;
    color: var(--color-ft-light);
    box-shadow: none;

    &.is-active {
        color: var(--color-ft-light);
        background-color: var(--color-bg-strong);
    }
}

.ButtonBase--transparent {
    background-color: transparent;
    color: var(--color-ft-light);
    box-shadow: none;

    &.is-active {
        background-color: transparent;
        box-shadow: none;
        color: var(--color-ft-light);
    }
}

.ButtonBase--light {
    background-color: var(--color-ft-light);
    color: var(--color-ft);

    &:active,
    &.is-loading {
        color: var(--color-ft-light);
        background-color: var(--color-cosmoz);

        .G_cosmoz {
            opacity: 0.75;
        }
    }
}

.ButtonBase--cosmoz {
    background-color: var(--color-cosmoz);

    .G_cosmoz {
        opacity: 0.75;
    }
    
    &.is-loading,
    &:active {
        background-color: var(--color-ft-light);
        color: var(--color-ft);

        .G_cosmoz {
            opacity: 0;
        }
    }
}

.ButtonBase--error {
    color: var(--color-ft-light);
    background-color: var(--color-error);
    border-radius: 3px;

    &.is-loading,
    &:active {
        background-color: var(--color-error-strong);
    }
}

.ButtonBase--full {
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
}

.ButtonBase--rect {
    width: 100%;
    text-align: left;
    border-radius: 8px;
    padding: 12px;
    background-color: transparent;
    border: 1px solid var(--color-border);
    box-shadow: none;

    .G_cosmoz {
        width: 40%;
        opacity: 0.15;
    }

    &:active {
        transform: translateY(-1px);
        background-color: var(--color-cosmoz);
        border-color: var(--color-cosmoz);
        color: var(--color-ft-light);
        box-shadow: 0 2px 8px 0 color-opacity('bg-xstrong', -75%);

        .G_cosmoz {
            opacity: 1;
        }
    }

    .ButtonBase_iconAfter {
        margin-left: auto;
    }

    .ButtonBase_text {
        padding-right: 12px;
    }

    .ButtonBase_iconBefore {
        margin-right: 4px;
        font-size: 18px;
    }

    .ButtonBase_content {
        flex-grow: 1;
        justify-content: flex-start;
    }
}

.ButtonBase.is-loading {
    pointer-events: none;
}

.ButtonBase:disabled,
.ButtonBase--disabled,
.ButtonBase.is-disabled {
    opacity: 0.5;
    pointer-events: none;
}

.ButtonBase--user {
    padding: 0 15px 0 3px;
    flex-shrink: 0;
    height: 44px;
    display: flex;
    align-items: center;
}

.ButtonBase--round {
    padding: 0;
    flex-shrink: 0;
    font-size: 16px;
    
    .ButtonBase_iconAfter,
    .ButtonBase_iconBefore {
        margin: 0;
    }

    .ButtonBase_content {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    &.ButtonBase--m {

        .ButtonBase_content {
            width: 45px;
            height: 45px;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
        }

    }

    &.ButtonBase--l {

        .ButtonBase_content {
            width: 60px;
            height: 60px;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
        }

    }

    &.ButtonBase--s {

        .ButtonBase_content {
            width: 36px;
            height: 36px;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
        }

    }

    &.ButtonBase--xs {

        .ButtonBase_content {
            width: 35px;
            height: 35px;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
        }
    }

    &.ButtonBase--2xs {

        .ButtonBase_content {
            width: 30px;
            height: 30px;
            min-height: 0;
            min-width: 0;
            padding: 0;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
            font-size: 12px;
        }
    }

    &.ButtonBase--3xs {

        .ButtonBase_content {
            width: 20px;
            height: 20px;
            min-height: 0;
            min-width: 0;
            padding: 0;
        }
    
        .ButtonBase_iconAfter,
        .ButtonBase_iconBefore {
            margin: 0;
            font-size: 12px;
        }
    }
}

.ButtonBase--highlight,
.ButtonBase--highlight-strong {
    border: 1px solid color-opacity('cosmoz', -70%);
    background-color: color-opacity('cosmoz', -45%);

    .G_cosmoz {
        opacity: 0.45;
    }

    &:active {
        background-color: var(--color-bg-light);
        color: var(--color-ft);
        border-color: transparent;

        .G_cosmoz {
            opacity: 0;
        }
    }
}

.ButtonBase--highlight-strong {
    background-color: var(--color-cosmoz);

    .G_cosmoz {
        opacity: 1;
    }
}

.ButtonBase--no-s {
    box-shadow: none !important;
}

@media(hover: hover) and (pointer: fine) {
    .ButtonBase:hover {
        background-color: var(--color-bg-light);
        color: var(--color-ft);
        transform: scale(0.99);
        box-shadow: 0 1px 4px 0 color-opacity('bg-2xstrong', -25%);
    }

    .ButtonBase--s:hover {
        transform: scale(0.98);
        box-shadow: 0 1px 3px 0 color-opacity('bg-2xstrong', -50%);
    }

    .ButtonBase--highlight-strong:hover,
    .ButtonBase--highlight:hover {
        background-color: var(--color-bg-light);
        color: var(--color-ft);
        border-color: transparent;

        .G_cosmoz {
            opacity: 0;
        }
    }

    .ButtonBase--rect:hover {
        transform: translateY(-1px);
        background-color: var(--color-cosmoz);
        border-color: var(--color-cosmoz);
        color: var(--color-ft-light);
        box-shadow: 0 2px 8px 0 color-opacity('bg-xstrong', -75%);

        .G_cosmoz {
            opacity: 1;
        }
    }

    .ButtonBase--weak:hover {
        color: var(--color-ft-light);
        background-color: var(--color-bg-strong);
    }

    .ButtonBase--xweak:hover {
        background-color: var(--color-bg-xweak);
        color: var(--color-ft-light);
        box-shadow: none;
    }

    .ButtonBase--transparent:hover {
        background-color: transparent;
        box-shadow: none;
        color: var(--color-ft-light);

        &.is-active {
            background-color: transparent;
        }
    }

    .ButtonBase--light:hover {
        color: var(--color-ft-light);
        background-color: var(--color-cosmoz);

        .G_cosmoz {
            opacity: 0.75;
        }
    }

    .ButtonBase--error:hover {
        color: var(--color-ft-light);
        background-color: var(--color-error-strong);
    }

    .ButtonBase--cosmoz:hover {
        background-color: var(--color-ft-light);
        color: var(--color-ft);

        .G_cosmoz {
            opacity: 0;
        }
    }


}
</style>