<template>
    <nav class="AppNav" :class="{ 'is-active': isActive }">
        <div class="AppNav_head"></div>
        
        <div class="AppNav_container">
            <div class="AppNav_header bg-cover-25 bg-night">
                <div class="mt-20" v-if="user">
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
        
        <div class="AppNav_navBar">
            <div class="AppNav_barItem" :class="{ 'is-active': (item.to == '/' && $route.path == item.to) || (item.to !== '/' && $route.path.includes(item.to)) || (item.items && item.items.find(i => i.to == $route.path)) }" v-for="(item, i) in nav" :key="i">
                <nuxt-link class="AppNav_barLabel" :to="item.to">
                    <div>
                        <fa class="icon d-block" :icon="`far fa-${item.fa}`" />
                        {{ item.label }}
                    </div>
                </nuxt-link>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'AppNav',
    props: {
        isActive: { type: Boolean, default: false }
    },
    data: () => ({
        nav: []
    }),
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
                label: `Événements`,
                fa: 'party-horn',
                to: this.localePath({ name: 'g' }),
                items: [
                    {
                        label: `Rejoindre un rassemblement`,
                        to: this.localePath({ name: 'g' })
                    }, {
                        label: `Rassemblements passés`,
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
    }
}
</script>

<style lang="scss" scoped>
.AppNav {
    position: relative;
    z-index: 15;

    &.is-active {

        .AppNav_container {
            transform: translateX(0%);
        }
    }
}

.AppNav_head {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    z-index: 20;
    transform: translateY(-100%);
    background-color: var(--color-bg-xstrong);
}

.AppNav_logo {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 30;
}

.AppNav_container {
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 0;
    left: 0;
    z-index: 10;
    width: 300px;
    height: 100vh;
    background-color: var(--color-bg-xstrong);
    transform: translateX(-100%);
    transition: all 150ms ease;
    z-index: 25;
    box-sizing: content-box;

    &:hover {
        transform: translateX(0%);
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

.AppNav_header {
    min-height: 180px;
    padding: 50px 20px 20px 20px;
    flex-grow: 0;
    flex-shrink: 0;
    background-color: var(--color-bg-2xstrong);
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
            background-color: var(--color-bg-strong);

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
        background-color: var(--color-bg-strong);
    }
}

.AppNav_navBar {
    display: none;
}

@include breakpoint-xs {
    
    .AppNav_container {
        display: none;
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