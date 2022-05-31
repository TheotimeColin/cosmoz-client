<template>
    <div class="QuickMenu" :class="[ { 'is-active': isActive, 'is-large': large }, ...$modifiers ]" v-if="items.filter(i => !i.disabled).length > 0" ref="body">
        <button-base class="QuickMenu_button" :class="{ 'is-active': isActive }" :icon-before="icon" :modifiers="buttonModifiers" @click="isActive = !isActive" />
        
        <div class="QuickMenu_actions">
            <component :is="item.to ? 'nuxt-link' : 'div'" :to="localePath(item.to)" class="QuickMenu_action" v-for="(item, i) in items.filter(i => !i.disabled)" :key="i" @click.native="onClick(item)">
                <fa class="QuickMenu_icon" :icon="`far fa-${item.fa}`" v-if="item.fa" /> {{ item.label }}
            </component>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'QuickMenu',
    mixins: [ ModifiersMixin ],
    props: {
        items: { type: Array, default: () => [] },
        large: { type: Boolean, default: false },
        icon: { type: String, default: 'ellipsis'}
    },
    data: () => ({
        isActive: false,
        listeners: {
            close: null
        }
    }),
    computed: {
        buttonModifiers () {
            let modifiers = []

            if (this.large) modifiers = ['weak']
            else if (this.modifiers.includes('strong')) modifiers = [...modifiers, 'xs', 'weak']
            else modifiers = [...modifiers, 'xs', 'xweak']

            if (this.modifiers.includes('s')) modifiers = [ ...modifiers, 's']

            return [...modifiers, 'round']
        }
    },
    watch: {
        isActive: {
            handler (v) {
                if (v && this.listeners.close) {
                    setTimeout(() => {
                        document.addEventListener('click', this.listeners.close)
                    }, 100)
                } else if (this.listeners.close) {
                    document.removeEventListener('click', this.listeners.close)
                }
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.listeners.close)
    },
    mounted () {
        this.listeners.close = (e) => {
            if (!this.$refs.body.contains(e.target)) this.isActive = false
        }
    },
    methods: {
        onClick (item) {
            this.isActive = false

            if (item.action) item.action() 
        }
    }
}
</script>

<style lang="scss" scoped>
    .QuickMenu {
        position: relative;
        
        &.is-large {
            
            .QuickMenu_actions {

                bottom: -8px;
            }
        }
    }

    .QuickMenu_actions {
        width: 250px;
        position: absolute;
        z-index: 10;
        bottom: -5px;
        right: 0;
        opacity: 0;
        padding: 5px;
        pointer-events: none;
        transform: translateY(calc(100% - 5px));
        background-color: var(--color-bg-xstrong);
        border-radius: 5px;
        transition: all 100ms ease;
    }

    .QuickMenu_action {
        font: var(--ft-title-3xs);
        border-radius: 4px;
        padding: 12px 12px;
        display: flex;
        align-items: center;
        min-height: 40px;
        cursor: pointer;

        &:hover {
            background-color: var(--color-bg-strong);

            .QuickMenu_icon {
                color: var(--color-ft-light);
            }
        }
    }

    .QuickMenu_icon {
        color: var(--color-ft-weak);
        width: 20px;
        margin-right: 8px;
    }

    .QuickMenu.is-active {

        .QuickMenu_actions {
            opacity: 1;
            transform: translateY(100%);
            pointer-events: all;
        }
    }

    .QuickMenu--right {

        .QuickMenu_actions {
            right: auto;
            left: 0;
        }
    }
</style>