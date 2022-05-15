<template>
    <nav class="NavAdmin" :class="[]">
        <nuxt-link to="/" class="NavAdmin_logo">
            <!-- <icon-base name="logo/logo-main" :height="50" /> -->
            gatherings
        </nuxt-link>

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

export default {
    name: 'NavAdmin',
    data: () => ({
        items: [
            { label: 'Tableau de bord', icon: 'mug-tea', exact: true, link: '' },

            { label: 'Gatherings', icon: 'calendar-alt', link: 'gatherings' },
            { label: 'Utilisateurs', icon: 'users', link: 'users' },
            { label: 'Blog', icon: 'pen-alt', link: 'articles' },
            { label: 'Lieux partenaires', icon: 'map-marker-alt', link: 'locations' },
            
            // { label: 'Blog', icon: 'newspaper', link: 'articles' },
            // { label: 'Utilisateurs', icon: 'users', link: 'users' },
            { label: 'Bibliothèque de médias', icon: 'image', link: 'other-medias' }
        ]
    })
}
</script>