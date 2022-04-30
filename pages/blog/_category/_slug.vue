<template>
    <article class="ArticlePage" v-if="article">
        <blog-banner :background="article.hero">
            <div class="text-center text-left@s">
                <p class="tape tape-strong mb-20 text-upper ft-m-bold" style="padding-right: 11px; letter-spacing: 0.05em"><i>{{ $t(`articles.categories.${article.category}`) }}</i></p>
                <h1 class="ft-title-xl ft-title-l@xs">{{ article.title|specials }}</h1>
                <p class="mt-20 ft-xl">{{ article.excerpt|specials }}</p>
            </div>
        </blog-banner>

        <div class="Wrapper Wrapper--s pv-60 pv-30@xs">
            <text-body :modifiers="['article']" :value="article.content" />
        </div>

        <div class="bg-bg-2xweak">
            <div class="Wrapper pv-40">
                <div class="row-s">
                    <div class="col-3 col-12@s">
                        <p class="ft-s color-ft-weak"><i>écrit avec amour par</i></p>
                        <p class="ft-title-s mb-20">Théotime Colin.</p>

                        <p v-if="updatedDate">Mis à jour le {{ updatedDate }}</p>
                        <p :class="{ 'color-ft-weak': updatedDate }">Publié le {{ createdDate }}</p>
                    </div>
                    <div class="col-9 col-12@s mt-40@s">
                        <div class="row-xs">
                            <div class="col-4 col-12@xs mt-10@xs" v-for="article in similarArticles" :key="article._id">
                                <block-article
                                    v-bind="article"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </article>
</template>

<script>
export default {
    name: 'ArticlePage',
    layout: 'blog',
    async fetch () {
        await this.$store.dispatch('article/get', { query: { slug: this.$route.params.slug }})

        await this.$store.dispatch('article/fetch')
    },
    computed: {
        article () {
            return this.$store.getters['article/findOne']({
                slug: this.$route.params.slug
            })
        },
        similarArticles () {
            let articles = this.$store.getters['article/find']({
                category: this.article.category
            })

            articles = articles.filter(article => article._id !== this.article._id)

            return articles
        },
        updatedDate () {
            return this.article.createdAt.isSame(this.article.updatedAt) ? null : this.article.updatedAt.format('DD MMM YYYY')
        },
        createdDate () {
            return this.article.createdAt.format('DD MMM YYYY')
        }
    },
    head () {
        let meta = {
            title: this.article.title + this.$t('meta.append'),
            meta: [
                { hid: 'description', name: 'description', content: this.article.excerpt.replace(/(<([^>]+)>)/gi, "") }
            ],
            script: [
                {
                    type: 'application/ld+json', json: {
                        structuredData: {
                            "@context": "http://schema.org",
                            "@type": "Article",
                            articleSection: this.$t(`articles.categories.${this.article.category}`),
                            articleBody: this.article.content.replace(/(<([^>]+)>)/gi, ""),
                            name: this.article.title,
                            headline: this.article.title,
                            image: this.article.hero,
                            thumbnailUrl: this.article.thumbnail,
                            dateCreated: this.article.createdAt.toISOString(),
                            dateUpdated: this.article.updatedAt.toISOString(),
                            author: this.$authorData()
                        }
                    }
                }
            ]
        }

        return meta
    }
}
</script>