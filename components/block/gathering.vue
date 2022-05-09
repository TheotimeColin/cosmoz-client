<template>
    <nuxt-link :to="link ? link : defaultLink" class="BlockGathering" :class="{ 'is-past': isPast }">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGathering_content">
                <div class="ft-s-bold fx-center width-100">
                    <div>
                        {{ tagline }}
                    </div>
                    <div v-if="hasBooked">
                        Je suis inscrit <span class="round-s bg-success ml-5"><i class="fal fa-check"></i></span>
                    </div>
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
    </nuxt-link>
</template>

<script>
export default {
    name: 'BlockGathering',
    props: {
        id: { type: String },
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

    }),
    computed: {
        user () { return this.$store.state.auth.user },
        hasBooked () { return this.attending.includes(this.user._id) },
        isPast () {
            return false
        },
        defaultLink () {
            return this.localePath({ name: 'g-id', params: { id: this.id } })
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
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
    display: block;
    border-radius: 8px;
    overflow: hidden;
    font: var(--ft-title-l);
    line-height: 1;
    background-color: var(--color-bg-xstrong);
    text-align: left;
    position: relative;
    
    &::before {
        @include ratio(40);
    }
}

.BlockGathering_content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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