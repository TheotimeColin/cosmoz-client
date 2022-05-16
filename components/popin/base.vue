<template>
    <div class="PopinBase" :class="[{ 'is-active': isActive }, ...$modifiers ]">
        <div class="PopinBase_body" ref="body">
            <div class="PopinBase_close" @click="$emit('close')">
                <fa icon="far fa-times" />
            </div>

            <div class="PopinBase_content">
                <slot name="content"></slot>
            </div>

            <div class="PopinBase_footer" v-if="$slots.footer || $slots.footerLeft || $slots.footerRight">
                <slot name="footer"></slot>
                <slot name="footerLeft"></slot>
                <slot name="footerRight"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'PopinBase',
    mixins: [ ModifiersMixin ],
    props: {
        isActive: { type: Boolean, default: false },
        autoClose: { type: Boolean, default: true }
    },
    data: () => ({
        listeners: {
            close: null
        }
    }),
    watch: {
        isActive: {
            handler (v) {
                if (!this.autoClose) return 
                if (v && this.$data.listeners.close) {
                    setTimeout(() => {
                        document.addEventListener('click', this.$data.listeners.close)
                    }, 100)
                } else if (this.$data.listeners.close) {
                    document.removeEventListener('click', this.$data.listeners.close)
                }
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.$data.listeners.close)
    },
    mounted () {
        this.$data.listeners.close = (e) => {
            if (!this.$refs.body.contains(e.target)) this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.PopinBase {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    pointer-events: none;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 350ms ease;
}

.PopinBase_body {
    background-color: var(--color-bg-strong);
    border-radius: 0px;
    width: 80%;
    max-width: 700px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    transform: translateY(5px);
    opacity: 0;
    border: none;
    transition: all 350ms ease;
    overflow: hidden;
}

.PopinBase_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 10px;
    min-height: 0;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-bg-xweak);
}

.PopinBase_content {
    flex-grow: 1;
    overflow: auto;
    position: relative;
}

.PopinBase_close {
    line-height: 1;
    cursor: pointer;
    font-size: 22px;
    color: var(--color-ft-light);
    position: absolute;
    z-index: 5;
    top: 10px;
    right: 15px;
    padding: 0;
}

/* STATES */

.PopinBase.is-active {
    pointer-events: all;
        background-color: rgba(40, 40, 40, 0.8);

    .PopinBase_body {
        transform: translateY(0);
        opacity: 1;
    }
}

/* MODIFIERS */

.PopinBase--l {
    
    .PopinBase_body {
        width: 90%;
        max-width: 1200px;
    }
}


.PopinBase--m {
    
    .PopinBase_body {
        max-width: 550px;
    }
}

.PopinBase--s {
    
    .PopinBase_body {
        max-width: 450px;
    }
}

.PopinBase--xs {
    
    .PopinBase_body {
        max-width: 300px;
    }
}

.PopinBase--hide-close {

    .PopinBase_close {
        display: none;
    }
}

.PopinBase--panel {
    justify-content: flex-end;

    .PopinBase_body {
        height: 100%;
        max-height: 100%;
        opacity: 1;
        transform: translateX(100%);
        transition: all 250ms ease;
    }

    &.is-active {
        
        .PopinBase_body {
            transform: translateX(0);
        }
    }
}

/* RESPONSIVE */

@include breakpoint-s {
    
    .PopinBase_body {
        width: auto;
        max-width: 100%;
        max-height: 100%;
    }
}


@include breakpoint-xs {

    .PopinBase--panel .PopinBase_body {
        width: 100%;
    }
    
    .PopinBase_body {
        height: 100vh;
        border-radius: 0;
    }
}
</style>