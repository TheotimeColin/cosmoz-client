<template>
    <component :is="link ? 'nuxt-link' : 'div'" :to="link ? link : null" class="BlockGathering">
        <div class="BlockGathering_cover" :style="{ backgroundImage: `url(${thumbnail})` }">
            {{ title }}
        </div>
        
        <div class="BlockGathering_content">
            <p class="BlockGathering_location">{{ location }}</p>
            <h3 class="BlockGathering_title">
                {{ subtitle }}
            </h3>
        </div>
    </component>
</template>

<script>
export default {
    name: 'BlockGathering',
    props: {
        title: { type: String },
        subtitle: { type: String },
        place: { type: String },
        location: { type: String },
        cover: { type: Object, default: () => ({}) },
        link: { type: Object },
    },
    computed: {
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockGathering_cover {
    display: flex;
    align-items: center;
    justify-content: center;
    font: var(--ft-title-m);
    background-color: var(--color-bg-weak);
    background-size: cover;
    background-position: center;
    
    &::before {
        @include ratio(50);
    }
}

.BlockGathering_content {
    margin-top: 10px;
}

.BlockGathering_title {
    font: var(--ft-title-s);
}

.BlockGathering_location {
    margin-bottom: 10px;
    font: var(--ft-s-medium);
    color: var(--color-ft-weak);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
</style>