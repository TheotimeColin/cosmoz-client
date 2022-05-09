<template>
    <nav class="AppNav">
        <div class="AppNav_header">
            <a :href="$config.appUrl" class="ft-title-s logo-sparkle-p">
                gatherings
            </a>
        </div>
        <div class="AppNav_sub">
            <div class="AppNav_menu">
                <nuxt-link class="AppNav_menuItem" :to="item.to" v-for="(item, i) in nav" :key="i">
                    <div class="AppNav_menuLabel">{{ item.label }}</div>

                    <div class="AppNav_menuChildren" v-if="item.items">
                        <nuxt-link class="AppNav_menuSubitem" :to="child.to" v-for="(child, j) in item.items" :key="j">
                            {{ child.label }}
                        </nuxt-link>
                    </div>
                </nuxt-link>
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
    created () {
        this.nav = [
            {
                label: `Les événements`,
                to: this.localePath({ name: 'index' }),
                items: [
                    {
                        label: `Suggestions`,
                        to: this.localePath({ name: 'gatherings' })
                    }, {
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