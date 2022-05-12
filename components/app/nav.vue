<template>
    <nav class="AppNav">
        <div class="AppNav_header">
            <a :href="$config.appUrl" class="ft-title-s logo-sparkle-p">
                gatherings
            </a>

            <div class="mt-20" v-if="user">
                <div class="d-flex fxa-center">
                    <user-icon class="mr-10" v-bind="user" />
                    
                    <link-base :to="localePath({ name: 'p-id', params: { id: user._id }})">{{ user.name }}</link-base>
                </div>
                <div class="mt-10">
                    <i class="fal fa-calendar mr-5"></i> {{ user.attended.length }} participations
                </div>
                <div class="mt-3">
                    <i class="fal fa-hand-wave mr-5"></i> {{ user.encounters.length }} rencontres
                </div>
            </div>
        </div>
        <div class="AppNav_sub">
            <div class="AppNav_menu">
                <div class="AppNav_menuItem" :class="{ 'is-active': item.to == $route.path }" v-for="(item, i) in nav" :key="i">
                    <nuxt-link class="AppNav_menuLabel" :to="item.to">{{ item.label }}</nuxt-link>

                    <div class="AppNav_menuChildren" v-if="item.items">
                        <nuxt-link class="AppNav_menuSubitem" :to="child.to" v-for="(child, j) in item.items" :key="j">
                            {{ child.label }}
                        </nuxt-link>
                    </div>
                </div>
            </div>
            <div class="AppNav_footer">
                <p class="subtitle ft-s">Mes tribus</p>

                <div class="mt-10 p-20 b text-center br-xs">
                    Tu n'appartiens à aucune tribu.
                    <link-base >Comment en rejoindre une ?</link-base>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'AppNav',
    data: () => ({
        nav: []
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
    },
    created () {
        this.nav = [
            {
                label: `Les événements`,
                to: this.localePath({ name: 'index' }),
                items: [
                    {
                        label: `Événements passés`,
                        to: this.localePath({ name: 'gatherings-past' })
                    }
                ]
            }, {
                label: `Mes affinités`,
                to: this.localePath({ name: 'affinites' })
            }, {
                label: `Mon compte`,
                to: this.localePath({ name: 'compte' })
            }
        ]
    }
}
</script>

<style lang="scss" scoped>
.AppNav {
    width: 300px;
    background-color: var(--color-bg-strong);
    flex-shrink: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 50;
}

.AppNav_header {
    height: 180px;
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
        }
    }
}

.AppNav_menuLabel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    font: var(--ft-l-bold);
    text-transform: uppercase;
    font-style: italic;
    letter-spacing: 0.05em;
    padding: 8px 20px 8px 30px;

    &::after {
        content: "\f105";
        font: var(--ft-icon-m);
    }
}

.AppNav_menuChildren {
    padding: 0 30px 0 40px;
    margin-bottom: 20px;
    opacity: 0;
    transform: translateX(-5px);
    pointer-events: none;
    position: absolute;
    transition: all 100ms ease;
}

.AppNav_menuSubitem {
    display: block;
    margin-top: 5px;
    color: var(--color-ft-weak);

    &.is-active-exact,
    &:hover {
        color: var(--color-ft-light);
    }
}
</style>