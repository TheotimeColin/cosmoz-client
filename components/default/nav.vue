<template>
    <nav
        class="AppNav"
        :class="{ 'is-active': isActive, 'is-panning': isPanning, 'is-closing': isClosePanning }"
        :style="{ '--pan': (pan + closePan) + 'px', '--opacity': 1 + ((pan + closePan) / 300) }"
        v-hammer:pan.horizontal="onPan"
        v-hammer:panend="onPanEnd"
    >
        <div class="AppNav_content">
            <div class="AppNav_header bg-cover-25 bg-night">
                <div v-if="user">
                    <div class="d-flex fxa-center">
                        <user-icon class="mr-10" v-bind="user" :display-name="true" />
                    </div>
                    <div class="mt-10">
                        <fa icon="far fa-calendar" class="mr-5" /> {{ user.gatherings.filter(g => g.status == 'confirmed').length }} participations
                    </div>
                    <div class="mt-3">
                        <fa icon="far fa-hand-wave" class="mr-5" /> {{ user.encounters.length }} rencontres
                    </div>
                </div>
            </div>
            <div class="AppNav_sub">
                <div class="AppNav_menu">
                    <div class="AppNav_menuItem" :class="{ 'is-active': (item.to == '/' && $route.path == item.to) || (item.to !== '/' && $route.path.includes(item.to)) || (item.items && item.items.find(i => i.to == $route.path)) }" v-for="(item, i) in nav" :key="i">
                        <nuxt-link class="AppNav_menuLabel" :to="item.to">
                            <span><fa class="icon" :icon="`far fa-${item.fa}`" /> {{ item.label }}</span>
                        </nuxt-link>

                        <div class="AppNav_menuChildren" v-if="item.items">
                            <nuxt-link class="AppNav_menuSubitem" :to="child.to" v-for="(child, j) in item.items" :key="j">
                                {{ child.label }}
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
        </div>
        <div class="AppNav_hider" @click="isActive = false"></div>
    </nav>
</template>

<script>
import Throttle from 'lodash.throttle'

export default {
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
        onPan: () => {}
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
        }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    },
    created () {
        this.nav = [
            {
                label: `Actualité`,
                fa: 'home',
                to: this.localePath({ name: 'feed' }),
            },
            {
                label: `Rencontrer`,
                fa: 'hand-wave',
                to: this.localePath({ name: 'g' }),
                items: [
                    {
                        label: `Participer à une rencontre`,
                        to: this.localePath({ name: 'g' })
                    }, {
                        label: `Mes rencontres passées`,
                        to: this.localePath({ name: 'g-past' })
                    }
                ]
            },
            {
                label: `Constellation`,
                fa: 'sparkles',
                to: this.localePath({ name: 'constellation' })
            }
        ]

        this.onPan = Throttle(v => {
            this.isClosePanning = true
            this.closePan = Math.min(0, this.closePan + (v.velocityX * 6))
        }, 2)
    },
    methods: {
        open () {
            this.isActive = true
        },
        onPanEnd (v) {
            this.isClosePanning = false
            this.$nextTick(() => this.closePan = 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.AppNav {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    transition: all 150ms ease;
    z-index: 100;
    
    &.is-active:not(.is-panning):not(.is-closing) {
        transform: translateX(0%) !important;

        .AppNav_hider {
            pointer-events: all;
            opacity: 1;
        }
    }

    &.is-panning {
        transform: translateX(calc(-100% + var(--pan, 0px)));
        transition: none;

        .AppNav_hider {
            opacity: calc(var(--opacity, 1) - 1);
        }
    }

    &.is-closing {
        transform: translateX(calc(0% + var(--pan, 0px)));
        transition: none;

        .AppNav_hider {
            pointer-events: all;
            opacity: var(--opacity, 1);
        }
    }
}

.AppNav_content {
    display: flex;
    flex-direction: column;
    width: 300px;
    height: 100vh;
    background-color: var(--color-bg-strong);
}

.AppNav_hider {
    position: fixed;
    top: 0;
    left: 300px;
    width: 100vw;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    opacity: 0;
}

.AppNav_logo {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30;
}

.AppNav_header {
    padding: 20px;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: var(--color-bg-xstrong);
}

.AppNav_sub {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.AppNav_menu {
    flex-grow: 1;
    margin-top: 30px;
}

.AppNav_footer {
    padding: 20px;
}

.AppNav_menuItem {
    display: block;
    margin-right: 30px;

    &.is-active {

        .AppNav_menuLabel {
            color: var(--color-ft-strong);
            background-color: var(--color-bg-light);

            .icon {
                color: var(--color-ft-strong);
            }

            &::after {
                transform: rotate(90deg);
            }
        }

        .AppNav_menuChildren {
            opacity: 1;
            transform: translateX(0px);
            pointer-events: all;
            position: relative;
        }
    }

    &:hover:not(.is-active) {

        .AppNav_menuLabel {
            background-color: var(--color-bg);

            .icon {
                color: var(--color-ft-light);
            }
        }
    }
}

.AppNav_menuLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
    font: var(--ft-title-2xs);
    padding: 15px 20px 15px 30px;

    .icon {
        width: 25px;
        margin-right: 5px;
        text-align: center;
        color: var(--color-ft-weak);
    }

    &::after {
        content: "\f105";
        font: var(--ft-icon-m);
    }
}

.AppNav_menuChildren {
    padding: 10px 0px 0 0;
    margin-bottom: 20px;
    opacity: 0;
    transform: translateX(-5px);
    pointer-events: none;
    position: absolute;
    transition: all 100ms ease;
}

.AppNav_menuSubitem {
    display: block;
    padding: 6px 0px 6px 60px;
    border-radius: 3px;
    color: var(--color-ft-weak);
    transition: all 100ms ease;

    &.is-active-exact,
    &:hover {
        color: var(--color-ft-light);
        background-color: var(--color-bg-weak);
    }
}

.AppNav_navBar {
    display: none;
}

@include breakpoint-xs {
    
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