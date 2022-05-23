<template>
    <component :is="parsedLink ? 'nuxt-link' : 'div'" :to="parsedLink ? parsedLink : null" class="BlockArticle">
        <div class="BlockArticle_cover">
            <div class="BlockArticle_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>
        </div>
        
        <div class="BlockArticle_content">
            <h3 class="BlockArticle_title">
                {{ title }}
            </h3>

            <p class="BlockArticle_date">{{ $moment(createdAt).format('D MMM YYYY') }}</p>
        </div>
    </component>
</template>

<script>
export default {
    name: 'BlockArticle',
    props: {
        _id: { type: String },
        title: { type: String },
        slug: { type: String },
        category: { type: String },
        cover: { type: Object, default: () => ({}) },
        createdAt: { type: String },
        link: { type: [Object, String, Boolean], default: false }
    },
    computed: {
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        },
        parsedLink () {
            return this.link ? this.link : this.localePath({ name: 'category-slug', params: { category: this.category, slug: this.slug } })
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockArticle {
    display: block;
    padding: 15px;
    border: 1px solid var(--color-bg-2xstrong);
    border-radius: 4px;
    box-shadow: 0 0 0 0 var(--color-bg-2xstrong);
    transition: all 100ms ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 0 0 var(--color-bg-2xstrong);
        background: var(--color-bg-light);
    }

    &:active {
        
        transform: translateY(-2px);
        box-shadow: 0 2px 0 0 var(--color-bg-2xstrong);
    }
}

.BlockArticle_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockArticle_cover {
    background-color: var(--color-bg-2xstrong);
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    &::before {
        @include ratio(60);
    }
}

.BlockArticle_date {
    margin-top: 10px;
    font: var(--ft-s);
    color: var(--color-ft-weak);
}

.BlockArticle_content {
    margin-top: 15px;
}

.BlockArticle_title {
    font: var(--ft-title-xs);
    color: var(--color-ft-strong);
    line-height: 1.2;
    transition: all 150ms ease; 
}
</style>