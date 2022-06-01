<template>
    <nav
        class="AppNav"
        :class="{ 'is-active': isActive, 'is-panning': isPanning, 'is-closing': isClosePanning, 'is-const': currentConst && $biggerThan('xs'), 'is-desktop': $biggerThan('xs') }"
        :style="{
            transform: isClosePanning ? `translateX(calc(0% + ${closePan}px))` : `translateX(calc(-100% + ${pan}px))`
        }"
        v-hammer:pan.horizontal="onPan"
        v-hammer:panend="onPanEnd"
        v-hammer:pancancel="onPanEnd"
    >
        <div class="AppNav_content">
            <div class="AppNav_primary">
                <button-base class="AppNav_icon" :class="{ 'is-active': selected == '' }" :modifiers="['round', 'weak']" icon-before="home" @click="selected = ''" />

                <orga-icon class="AppNav_orga AppNav_icon" :class="{ 'is-active': selected == orga._id }" :modifiers="['m']" :no-link="true" v-for="orga in organizations" v-bind="orga" :key="orga._id" @click.native="selected = orga._id" />
            </div>
            <div class="AppNav_sub">
                <transition-group name="fade">
                    <div v-if="!selected" key="selected">
                        <div class="AppNav_header bg-cover bg-night" v-if="user">
                            <user-icon v-bind="user" :display-name="true" />
                        </div>
                        
                        <div class="AppNav_menu">
                            <div class="AppNav_menuItem" v-for="(cat, i) in nav" :key="i">
                                <p class="ft-s color-ft-weak mb-5" v-if="cat.label">{{ cat.label }}</p>

                                <div class="AppNav_menuChildren">
                                    <nuxt-link class="AppNav_menuSubitem" :to="localePath(child.to)" v-for="(child, j) in cat.children" :key="j">
                                        <fa :icon="`far fa-${child.fa}`" /> {{ child.label }}
                                    </nuxt-link>
                                </div>
                            </div>
                        </div>

                        <div class="AppNav_footer">
                            <div class="mt-10 p-20 b text-center br-xs">
                                Une question ? Besoin d'aide ?
                                <link-base :to="{ name: 'faq' }">Centre d'aide</link-base>
                            </div>
                        </div>
                    </div>
                    <page-const-nav v-bind="selectedOrga" v-else key="selectedOrga" />
                </transition-group>
            </div>
        </div>

        <div class="AppNav_hider" :style="{ opacity: isClosePanning ? 1 + (closePan / 300) : (pan / 300) }" @click="isActive = false"></div>
    </nav>
</template>

<script>
export default {
    async fetch () {
        await this.$store.dispatch('organization/fetch', {
            query: {}
        })
    },
    name: 'AppNav',
    props: {
        pan: { type: Number, default: 0 },
        isPanning: { type: Boolean, default: false },
    },
    data: () => ({
        isActive: false,
        nav: [],
        isClosePanning: false,
        closePan: 0,
        selected: ''
    }),
    watch: {
        $route () {
            this.isActive = false
        },
        isPanning (v) {
            if (!v && this.pan > 100) this.isActive = true
        },
        isClosePanning (v) {
            if (!v && this.closePan < -25) this.isActive = false
        },
        currentConst: {
            immediate: true,
            handler (v) {
                this.selected = v
            }
        },
        isActive (v) {
            if (!v) setTimeout(() => this.selected = this.currentConst, 200)

            this.$store.commit('page/toggleOverflow', !v)
        }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        organizations () {
            return this.$store.getters['organization/find']({
            })
        },
        selectedOrga () {
            return this.organizations.find(o => o._id == this.selected)
        },
        currentConst () { return this.$store.state.page.currentConst }
    },
    created () {
        this.nav = [
            {
                children: [
                    { label: `Actualité`, fa: 'home', to: { name: 'feed' } },
                    { label: `Constellation`, fa: 'sparkles', to: { name: 'constellation' } },
                ]
            }, {
                label: `Rencontres`,
                children: [
                    { label: `À venir`, fa: 'calendar', to: { name: 'g' } },
                    { label: `Passées`, fa: 'home', to: { name: 'g-past' } },
                ]
            }
        ]
    },
    methods: {
        open () {
            this.isActive = true
        },
        onPan (v) {
            this.isClosePanning = true
            this.closePan = Math.min(0, v.deltaX)
        },
        onPanEnd () {
            this.isClosePanning = false
            this.isFirst = false
            this.$nextTick(() => this.closePan = 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.AppNav {
    position: fixed;
    top: var(--header-height);
    left: 0;
    transform: translateX(-100%);
    transition: all 200ms ease;
    z-index: 100;
    
    &.is-desktop:hover,
    &.is-const,
    &.is-active:not(.is-panning):not(.is-closing) {
        transform: translateX(0%) !important;

        .AppNav_hider {
            opacity: 1 !important;
        }
    }

    &.is-panning {
        transition: none;

        .AppNav_hider {
            opacity: calc(var(--opacity, 1) - 1);
        }

        .AppNav_sub {
            overflow: hidden;
        }
    }

    &.is-closing {
        transition: none;

        .AppNav_sub {
            overflow: hidden;
        }
    }

    &.is-const {
        top: var(--header-height);
        
        .AppNav_hider {
            display: none;
        }
    }
    
    &::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        right: -5px;
        height: 100%;
        width: 5px;
    }
}

.AppNav_content {
    display: flex;
    width: 320px;
    height: 100vh;
    background-color: var(--color-bg-strong);
}

.AppNav_primary {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    background-color: var(--color-bg-xstrong);
}

.AppNav_icon {
    cursor: pointer;
    transition: all 100ms ease-out;
    opacity: 0.5;

    &:hover {
        transform: scale(0.95);
        opacity: 1;
    }

    &:active {
        transform: scale(0.90);
    }

    &.is-active {
        opacity: 1;
        pointer-events: none;
        transform: scale(0.95);
    }

    & + & {
        margin-top: 10px;
    }
}

.AppNav_sub {
    display: flex;
    flex-direction: column;
    overflow: auto;
    touch-action: pan-y !important;
}

.AppNav_hider {
    position: fixed;
    top: 0;
    left: 320px;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    opacity: 0;
    transition: opacity 150ms ease;
}

.AppNav_logo {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30;
}

.AppNav_header {
    background-size: cover;
    background-position: center;
    background-color: var(--color-bg-xstrong);
    display: flex;
    align-items: center;
    padding: 5px 15px;

    &::after {
        content: "";
        @include ratio(33);
    }
}

.AppNav_sub {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.AppNav_menu {
    flex-grow: 1;
    padding: 15px;
}

.AppNav_menuItem {

    & + & {
        margin-top: 20px;
    }
}

.AppNav_menuSubitem  {
    font: var(--ft-title-2xs);
    line-height: 1;
    cursor: pointer;
    color: var(--color-ft-light);
    text-decoration-color: var(--color-ft-xweak);
    border-radius: 5px;
    transition: all 100ms ease;

    display: block;
    padding: 12px 10px;

    svg {
        margin-right: 8px;
    }

    &:hover,
    &.is-active {
        background-color: var(--color-bg);
    }
}

.AppNav_footer {
    padding: 15px;
}

.AppNav_navBar {
    display: none;
}

@include breakpoint-xs {

    .AppNav {
        top: 0;
        
        &.is-active:not(.is-panning):not(.is-closing) {

            .AppNav_hider {
                pointer-events: all;
            }
        }

        &.is-closing {

            .AppNav_hider {
                pointer-events: all;
            }
        }
    }

    .AppNav_hider {
        transition: none;
    }
    
    .AppNav_navBar {
        background-color: var(--color-bg-xstrong);
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        padding: 6px;
    }

    .AppNav_barLabel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60px;
        height: 60px;
        text-align: center;

        &.is-active {
            color: var(--cosmoz-weak);
        }

        & > div {
            font: var(--ft-2xs);
        }

        .icon {
            font-size: 18px;
            margin: 0 auto 5px;
        }
    }
}
</style>