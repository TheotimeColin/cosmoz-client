<template>
    <div class="PopinBase" :class="[{ 'is-active': isActive }, ...$modifiers ]">
        <div class="PopinBase_hider" @click="$emit('close')"></div>

        <div class="PopinBase_body" ref="body">
            <div class="PopinBase_header" v-if="title">
                <div class="PopinBase_headerLeft">
                    <button-base :modifiers="['round', 'transparent', 'ripples']" icon-before="arrow-left" @click="$emit('close')" />
                    <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                        {{ title }}
                    </h1>
                </div>
                <div></div>
            </div>

            <div class="PopinBase_close" @click="$emit('close')" v-else>
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
        title: { type: String, default: '' },
        isActive: { type: Boolean, default: false },
        autoClose: { type: Boolean, default: true },
        query: { type: [String, Boolean], default: false }
    },
    data: () => ({
        listeners: {
            close: null,
            echap: null
        }
    }),
    watch: {
        isActive: {
            handler (v) {
                let query = this.$route.query

                if (v && this.query) {
                    this.$router.push({ query: { ...query, [this.query]: 'true' } })
                } else if (!v && this.query) {
                    this.$router.push({ query: { ...query, [this.query]: undefined } })
                }

                if (!this.autoClose) return 
                
                if (v && this.listeners.close) {
                    this.$store.commit('page/toggleOverflow',  false)

                    setTimeout(() => {
                        document.addEventListener('click', this.listeners.close)
                    }, 100)
                } else if (this.listeners.close) {
                    document.removeEventListener('click', this.listeners.close)

                    this.$store.commit('page/toggleOverflow', true)
                }

                if (v && this.listeners.echap) {
                    document.addEventListener('keydown', this.listeners.echap)
                } else if (this.listeners.echap) {
                    document.removeEventListener('keydown', this.listeners.echap)
                }
            }
        },
        [`$route.query`]: {
            immediate: true,
            handler (v) {
                if (this.query && v[this.query] !== 'true') {
                    this.$emit('close')
                } else if (this.query && v[this.query] == 'true') {
                    this.$emit('open')
                }
            }
        }
    },
    beforeDestroy () {
        document.removeEventListener('click', this.listeners.close)
        this.$store.commit('page/toggleOverflow', true)
    },
    mounted () {
        this.listeners.close = (e) => {
            // if (!this.$refs.body.contains(e.target)) this.$emit('close')
        }

        this.listeners.echap = (e) => {
            if (e.which == 27) this.$emit('close')
        }
    }
}
</script>

<style lang="scss" scoped>
.PopinBase {
    position: fixed;
    top: -9999px;
    left: -9999px;
    width: 100%;
    height: 100%;
    background-color: transparent;
    pointer-events: none;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 1ms all;
    transition-delay: 350ms;
}

.PopinBase_hider {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background-color: color-opacity('bg-xstrong', -65%);
    pointer-events: none;
    opacity: 0;
    transition: all 300ms ease;
}

.PopinBase_body {
    background-color: var(--color-bg);
    border-radius: 4px;
    width: 90%;
    max-width: 700px;
    max-height: 90%;
    display: flex;
    flex-direction: column;
    transform: scale(0.98) translateY(5px);
    opacity: 0;
    border: none;
    transition: all 300ms ease;
    overflow: hidden;
    position: relative;
    z-index: 5;
    box-shadow: 0 5px 12px 0 color-opacity('bg-2xstrong', -75%);
}

.PopinBase_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 0;
    border-color: var(--color-border-weak);
    overflow: hidden;
}

.PopinBase_headerLeft {
    display: flex;
    align-items: center;
    height: var(--app-height);
}

.PopinBase_footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 0px;
    min-height: 0;
    border: none;
    background-color: var(--color-bg-strong);
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
    top: 0px;
    right: 0px;
    padding: 15px 20px;
}

/* STATES */

.PopinBase.is-active {
    top: 0;
    left: 0;
    pointer-events: all;
    transition-delay: 0ms;

    & > .PopinBase_body {
        transform: translateY(0);
        opacity: 1;
    }

    .PopinBase_hider {
        pointer-events: all;
        opacity: 1;
        background-color: color-opacity('bg-2xstrong', -15%);
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
        border-radius: 0;
    }

    &.is-active {
        
        .PopinBase_body {
            transform: translateX(0);
        }
    }
}

.PopinBase--panel-bottom {
    height: calc(100% - var(--header-height));

    &.is-active {
        top: var(--header-height);
    }
}

/* RESPONSIVE */

@include breakpoint-s {

    .PopinBase--panel-bottom {
        height: calc(100% - var(--sticky-height));

        &.is-active {
            top: 0;
        }
    }
    
    .PopinBase_body {
        max-width: 100%;
        max-height: 100%;
    }

    .PopinBase--panel {

        .PopinBase_body {
            width: 90%;
        }
    }
}


@include breakpoint-xs {

    .PopinBase {
        align-items: flex-end;
    }

    .PopinBase_close {
        font-size: 26px;
    }

    .PopinBase--panel .PopinBase_body {
        width: 100%;
    }
    
    .PopinBase_body {
        width: 100%;
        max-width: 100% !important;
        height: 95vh;
        border-radius: 0;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
        transform: translateY(100%);
        opacity: 1;
        transition: all 250ms ease;
    }

    .PopinBase--panel {

        .PopinBase_body {
            border-radius: 0;
        }
    }
}
</style>