<template>
    <nav class="NavAdmin" :class="[]">
        <a :href="$config.baseUrl + '/feed'" class="NavAdmin_logo bg-cover bg-night">
            <img :src="assets.logo" height="25" class="n-mt-5">
        </a>

        <div class="NavAdmin_items">
            <div class="NavAdmin_item" v-for="(item, i) in items" :key="i">
                <nuxt-link
                    class="NavAdmin_link"
                    :class="{ 'is-disabled': item.disabled }"
                    :to="localePath({ name: item.link })"
                    :exact="item.exact"
                >
                    <fa class="mr-3" :icon="`far fa-${item.icon}`" /> {{ item.label }}
                </nuxt-link>
            </div>
        </div>

        <div></div>
    </nav>
</template>

<script>
import logo from '@/assets/img/logo/logo_white_sparkles.webp'

export default {
    name: 'NavAdmin',
    data: () => ({
        assets: { logo },
        items: [
            { label: 'Tableau de bord', icon: 'mug-tea', exact: true, link: '' },
            { label: 'Gatherings', icon: 'calendar-alt', link: 'admin-gatherings' },
            { label: 'Utilisateurs', icon: 'users', link: 'admin-users' },
            { label: 'Groupes', icon: 'sparkles', link: 'admin-constellations' },
            { label: 'Blog', icon: 'pen-alt', link: 'admin-articles' },
            { label: 'Bibliothèque de médias', icon: 'image', link: 'admin-other-medias' },
            { label: 'Emails', icon: 'envelope', link: 'admin-other-mails' },
        ]
    })
}
</script>

<style lang="scss" scoped>
    .NavAdmin {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-color: var(--color-bg-xstrong);
    }

    .NavAdmin_items {
        width: calc(100% - 20px);
    }

    .NavAdmin_item {
        position: relative;

        &:hover {
            background-color: var(--color-bg-xweak);

            .NavAdmin_sub {
                display: block;
            }
        }
    }

    .NavAdmin_sub {
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%);
        padding: 5px;
        border: 1px solid var(--color-border);
        display: none;
    }

    .NavAdmin_link {
        display: block;
        font: var(--ft-m);
        font-weight: 500;
        padding: 10px 5px;
        border-bottom: 1px solid var(--color-border);
    }

    .NavAdmin_logo {
        font: var(--ft-title-m);
        width: var(--nav-base);
        padding: 60px 20px;
        text-align: center;
    }
</style>