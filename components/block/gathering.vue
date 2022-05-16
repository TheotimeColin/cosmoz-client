<template>
    <nuxt-link :to="link ? link : defaultLink" class="BlockGathering" :class="[ { 'is-past': isPast }, ...$modifiers ]">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGathering_content">
                <div class="ft-s-bold fx-center width-100">
                    <div v-if="!statusOnly">
                        {{ tagline }}
                    </div>
                    <div class="BlockGathering_status">
                        <template v-if="hasBooked">
                            <span class="round-s bg-success mr-5"><fa icon="far fa-check" /></span> Inscrit
                        </template>
                        <template v-else-if="hasConfirmed">
                            Présence confirmée <span class="round-s bg-success ml-5"><fa icon="far fa-check" /></span>
                        </template>
                        <template v-else-if="hasGhosted">
                            Je n'y suis pas allé <span class="round-s bg-bg-xweak ml-5"><fa icon="far fa-warning" /></span>
                        </template>
                    </div>
                </div>

                <div>
                    <div class="BlockGathering_location fx-center">
                        <p class="">
                            {{ $moment(date).fromNow() }} <span class="loc">· {{ location }}</span>
                        </p>
                    </div>

                    <h3 class="BlockGathering_title ellipsis-3">
                        {{ title }}
                    </h3>
                </div>
            </div>
        </div>
    </nuxt-link>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'BlockGathering',
    mixins: [ ModifiersMixin ],
    props: {
        id: { type: String },
        title: { type: String },
        max: { type: Number, default: 0 },
        users: { type: Array, default: () => [] },
        place: { type: String },
        location: { type: String },
        date: { type: [Date, String] },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false },
        statusOnly: { type: Boolean, default: false }
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        hasBooked () { return this.users.find(u => u._id == this.user._id && u.status == 'attending') },
        hasConfirmed () { return this.users.find(u => u._id == this.user._id && u.status == 'confirmed') },
        hasGhosted () { return this.users.find(u => u._id == this.user._id && u.status == 'ghosted') },
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
        attending () {
            return this.users.filter(u => u.status == 'attending' || u.status == 'confirmed')
        },
        waiting () {
            return this.users.filter(u => u.status == 'waiting')
        },
        tagline () {
            let tagline = this.attending.length + ' inscrits'

            if (this.attending.length == 0 && this.max > 0) {
                tagline = `${this.max} places restantes`
            } else if (this.max <= this.attending.length) {
                tagline = `Événement complet`
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
    background-color: var(--color-bg-2xstrong);
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

.BlockGathering--square {

    .BlockGathering_cover {

        &::before {
            @include ratio(100);
        }
    }

    .loc {
        display: none;
    }

    .BlockGathering_location {
        font: var(--ft-2xs);
    }

    .BlockGathering_title {
        font: var(--ft-title-xs);
    }
}

@include breakpoint-s {

}

</style>