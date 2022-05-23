<template>
    <nuxt-link :to="link ? link : defaultLink" class="BlockGathering" :class="[ ...$modifiers ]">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGathering_content">
                <div class="BlockGathering_header">
                    <div class="d-flex fxa-center mr-10" v-if="!statusOnly && organization">
                        <orga-icon class="mr-10" v-bind="organization" /> {{ orgaShort ? '' : 'Organisé par'}} {{ organization.name }}
                    </div>
                    <div class="BlockGathering_status d-none@xs" v-if="!orgaOnly">
                        <div>
                            <template v-if="hasBooked">
                                <span class="round-s bg-success mr-5"><fa icon="far fa-check" /></span> Inscrit ·
                            </template>
                            <template v-else-if="hasConfirmed">
                                <span class="round-s bg-success ml-5"><fa icon="far fa-check" /></span> Présence confirmée ·
                            </template>
                            <template v-else-if="hasGhosted">
                                <span class="round-s bg-bg-xweak ml-5"><fa icon="far fa-warning" /></span> Je n'y suis pas allé ·
                            </template>

                            {{ tagline }}
                        </div>
                    </div>
                </div>

                <div>
                    <div class="BlockGathering_status mb-15 d-none d-block@xs" v-if="!orgaOnly">
                        <div>
                            <template v-if="hasBooked">
                                <span class="round-s bg-success mr-5"><fa icon="far fa-check" /></span> Inscrit ·
                            </template>
                            <template v-else-if="hasConfirmed">
                                <span class="round-s bg-success ml-5"><fa icon="far fa-check" /></span> Présence confirmée · 
                            </template>
                            <template v-else-if="hasGhosted">
                                <span class="round-s bg-bg-xweak ml-5"><fa icon="far fa-warning" /></span> Je n'y suis pas allé ·
                            </template>

                            {{ tagline }}
                        </div>
                    </div>

                    <div class="BlockGathering_location fx-center">
                        <p class="">
                            {{ $moment(date).fromNow() }} <span class="loc">· {{ location }}</span>
                        </p>
                    </div>

                    <h3 class="BlockGathering_title ellipsis-2">
                        {{ title|specials }}
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
        statusOnly: { type: Boolean, default: false },
        isPast: { type: Boolean, default: false },
        orgaOnly: { type: Boolean, default: false },
        orgaShort: { type: Boolean, default: false },
        organization: { type: [Object, Boolean], default: false },
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        hasBooked () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'attending') : false },
        hasConfirmed () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'confirmed') : false },
        hasGhosted () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'ghosted') : false },
        defaultLink () {
            return this.localePath({ name: 'o-slug-id', params: { id: this.id, slug: this.organization ? this.organization.slug : 'event' } })
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
            
            if (this.isPast) {
                tagline = this.attending.length <= 0 ? '' : this.attending.length + ' ont participé'
            } else if (this.hasBooked) {
                return tagline
            } else if (this.attending.length == 0 && this.max > 0) {
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
    background-color: var(--color-black);
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

.BlockGathering_status {
    flex-shrink: 0;
    font: var(--ft-s-bold);
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

.BlockGathering_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font: var(--ft-title-3xs);
    width: 100%;
}

.BlockGathering--square {

    .BlockGathering_content {
        padding: 15px;
    }

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

@include breakpoint-xs {
        
    .BlockGathering_cover {
        
        &::before {
            @include ratio(100);
        }
    }

    .BlockGathering_header {
        display: block;
    }

    .BlockGathering_status {
        margin-top: 15px;
    }
}

</style>