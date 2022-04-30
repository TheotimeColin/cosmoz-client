<template>
    <div>
        <blog-banner class="bg-aluminium">
            <div>
                <h1 class="ft-title-xl ft-title-l@xs">Le blog en ligne de la rencontre hors-ligne</h1>
                <p class="mt-20">Le passé, le présent et le futur de la rencontre.</p>
            </div>
        </blog-banner>

        <div class="Wrapper pv-60">
            <p class="ft-title-m color-ft-strong">Quoi de neuf ?</p>

            <div class="row-s">
                <div class="col-4 col-12@s mt-20" v-for="article in articles" :key="article._id">
                    <block-article
                        v-bind="article"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BlogPage',
    layout: 'blog',
    async fetch () {
        await this.$store.dispatch('article/fetch', {
            query: {}
        })
    },
    created () {
        this.$store.commit('page/setBanner', { classes: ['bg-holo'] } )
    },
    computed: {
        articles () { return this.$store.getters['article/find']() },
    }
}
</script>