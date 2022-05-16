<template>
    <component
        :is="tag"
        class="ButtonBase"
        :class="[ $modifiers, (node ? node.attrs.class : []) ]"
        v-bind="computedAttrs"
        v-on="$listeners"
    >
        <div class="ButtonBase_content">
            <span class="ButtonBase_iconBefore" v-if="iconBefore">
                <fa :icon="`far fa-${iconBefore}`" />
            </span>

            <span class="ButtonBase_before" v-if="$slots.before">
                <slot name="before"></slot>
            </span>
            <span class="ButtonBase_text">
                {{ text ? text : '' }}
                <slot></slot>
            </span>
            <span class="ButtonBase_after" v-if="$slots.after">
                <slot name="after"></slot>
            </span>

            <span class="ButtonBase_iconAfter" v-if="iconAfter">
                <fa :icon="`far fa-${iconAfter}`" />
            </span>
        </div>

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
        tag: { type: String, default: 'button' },
        link: { type: String },
        text: { type: String },
        node: { type: Object, default: () => {} },
        iconBefore: { type: String, default: '' },
        iconAfter: { type: String, default: '' },
        iconLoading: { type: String, default: 'spinner-third' },
        attrs: { type: Object, default: () => ({}) }
    },
    computed: {
        computedAttrs () {
            return {
                href: this.$props.link,
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
    font: var(--ft-title-2xs);
    line-height: 1;
    color: var(--color-ft-light);
    border: 2px solid var(--color-ft);
    background-color: var(--color-ft);
    padding: 12px 15px;
    border-radius: 40px;
    transition: all 150ms ease;
    text-align: center;
    transform-origin: center;
    justify-content: center;
    position: relative;

    cursor: pointer;

    &:hover,
    &:active {
        background-color: transparent;
        color: var(--color-ft-light);
    }

    &:active {
        transform: scale(0.96);
    }
}

.ButtonBase_content {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    white-space: nowrap;
}

.ButtonBase_iconLoading {
    pointer-events: none;
    font-size: 150%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    line-height: 1;
    opacity: 0;
    animation: baseSpin 1000ms cubic-bezier(0.39, 0.32, 0.18, 0.87) 0s infinite;
}

.ButtonBase_iconBefore {
    margin-right: 8px;
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

.ButtonBase--link {
    display: inline-flex;
    background-color: transparent;
    color: var(--color-primary);
    padding: 0;
    text-align: left;
}

.ButtonBase.is-loading {

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

.ButtonBase--current {
    border-color: var(--color-current-strong);
    color: var(--color-current-strong);
    background-color: transparent;

    &:hover,
    &:active {
        color: var(--color-ft-light);
        background-color: var(--color-current-strong);
    }

    &:active {
        border-color: var(--color-current-xstrong);
        background-color: var(--color-current-xstrong);
    }
}

.ButtonBase--light {
    background-color: var(--color-ft-light);
    border-color: var(--color-ft-light);
    color: var(--color-ft);

    &:hover,
    &:active {
        color: var(--color-ft-light);
        background-color: transparent;
    }
    
    .ButtonBase_iconLoading {
        color: var(--color-ft);
    }
}

.ButtonBase--full {
    display: flex;
    justify-content: center;
    text-align: center;
    width: 100%;
}

.ButtonBase--s {
    padding: 10px 15px;
    font: var(--ft-title-3xs);
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

.ButtonBase--round {
    padding: 0;
    flex-shrink: 0;
    
    .ButtonBase_iconAfter,
    .ButtonBase_iconBefore {
        margin: 0;
    }

    .ButtonBase_content {
        width: 45px;
        height: 45px;
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
            width: 40px;
            height: 40px;
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
            font-size: 14px;
        }
    }
}
</style>