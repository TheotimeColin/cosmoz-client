<template>
    <div>
        <div class="Page_content Wrapper">
            <div class="fx-grow pb-100">
                <div class="row-s">
                    <div class="col-4 col-12@s mb-40" v-for="article in articles" :key="article._id">
                        <block-article
                            v-bind="article"
                            class="bg-bg-light"
                            :link="localePath({ name: 'admin-articles-id', params: { id: article._id } })"
                        />
                    </div>
                </div>
            </div>

            <div class="Page_side">
                <button-base
                    :modifiers="['light']"
                    icon-before="plus"
                    :to="{ name: 'admin-articles-id', params: { id: 'new' } }"
                >
                    Créer un nouvel article
                </button-base>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticlesPage',
    layout: 'admin',
    middleware: 'admin',
    async fetch () {
        await this.$store.dispatch('article/fetch', {
            query: {}
        })
    },
    computed: {
        articles () { return this.$store.getters['article/find']() },
    }
}
</script>