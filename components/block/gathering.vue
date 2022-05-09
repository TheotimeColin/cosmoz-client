<template>
    <component :is="link ? 'nuxt-link' : 'div'" :to="link ? link : null" class="BlockGathering" :class="{ 'is-past': isPast, 'is-favorite': hasFavorited }">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGathering_content">
                <div class="ft-s-bold">
                    {{ tagline }}
                </div>

                <div>
                    <div class="BlockGathering_location fx-center">
                        <p class="">
                            {{ $moment(date).fromNow() }} · {{ location }}
                        </p>
                    </div>

                    <h3 class="BlockGathering_title">
                        {{ title }}
                    </h3>
                </div>
            </div>
        </div>
    </component>
</template>

<script>
export default {
    name: 'BlockGathering',
    props: {
        _id: { type: String },
        title: { type: String },
        max: { type: Number, default: 0 },
        attending: { type: Array, default: () => [] },
        waiting: { type: Array, default: () => [] },
        place: { type: String },
        location: { type: String },
        date: { type: Date },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false }
    },
    data: () => ({
        hasFavorited: false,
        hasPendingFavorite: false
    }),
    created () {
        if (this.$cookies.get('fav-' + this._id)) this.hasFavorited = true
    },
    computed: {
        isPast () {
            return false
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        },
        favoritesNumber () {
            return this.favorites + (this.hasPendingFavorite ? 1 : 0)
        },
        tagline () {
            let tagline = this.attending.length + ' inscrits'

            if (this.attending.length == 0 && this.max > 0) {
                tagline = `${this.max} places restantes`
            } else if (this.max == this.attending.length && this.waiting.length > 0) {
                tagline = `${this.waiting.length} en liste d'attente`
            } else if (this.max == this.attending.length) {
                tagline = `Sur liste d'attente`
            } else if (this.max - this.attending.length <= 5) {
                tagline = `Plus que ${this.max - this.attending.length} places !`
            }

            return tagline
        }
    },
    methods: {
        async onFavorite () {
            if (this.hasFavorited) return

            this.$cookies.set('fav-' + this._id, true, { maxAge: 999999 })
            this.hasPendingFavorite = true
            this.hasFavorited = true

            await this.$store.dispatch('gathering/create', {
                _id: this._id,
                params: { favorites: '$inc' }
            })

            this.hasPendingFavorite = false

            this.$emit('favorite')
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockGathering {
    display: block;

    &:hover {
    
    }
}

.BlockGathering_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.3;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockGathering_favs {
    cursor: pointer;
}

.BlockGathering_cover {
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    font: var(--ft-title-l);
    line-height: 1;
    background-color: var(--color-bg-xstrong);
    text-align: left;
    position: relative;
    
    &::before {
        @include ratio(50);
    }
}

.BlockGathering_content {
    position: relative;
    padding: 20px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
}

.BlockGathering_title {
    font: var(--ft-title-s);
    transition: all 150ms ease; 
}

.BlockGathering_location {
    margin-bottom: 5px;
    font: var(--ft-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

@include breakpoint-s {

}

</style>