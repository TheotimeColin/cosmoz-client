<template>
    <div class="BlockGathering" :class="[ ...$modifiers ]">
        <div class="BlockGathering_cover">
            <div class="BlockGathering_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }">
            </div>

            <div class="BlockGathering_content">
                <div class="BlockGathering_header">
                    <const-icon class="mr-10" :modifiers="['s']" :display-name="true" v-bind="constellationData" />
                </div>

                <div>
                    <user-list class="fx-grow mb-5" :modifiers="['transparent', 's']" :items="attending" :max="4" :hide-text="true" v-if="attending.length > 0" />
                    
                    <div class="BlockGathering_details fx-center">
                        <p v-if="date || location">
                            <template v-if="date">
                                {{ $moment(date).fromNow() }}
                            </template>
                            
                            <span class="BlockGathering_location">
                                <span class="loc">·</span> {{ location ? location : '' }}
                            </span>
                        </p>
                    </div>

                    <h3 class="BlockGathering_title ellipsis-2">
                        {{ title|specials }}
                    </h3>
                </div>
            </div>

            <div class="BlockGathering_actions">
                <slot></slot>
            </div>
        </div>

        <nuxt-link class="BlockGathering_link" :to="replaceLink ? replaceLink : defaultLink" v-if="!noLink || replaceLink"></nuxt-link>
    </div>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'BlockGathering',
    mixins: [ ModifiersMixin ],
    props: {
        id: { type: String },
        title: { type: String },
        intro: { type: String },
        max: { type: Number, default: 0 },
        users: { type: Array, default: () => [] },
        place: { type: String },
        location: { type: String },
        date: { type: [Date, String] },
        cover: { type: Object, default: () => ({}) },
        replaceLink: { type: [Object, Boolean, String], default: false },
        link: { type: [Object, Boolean, String], default: false },
        statusOnly: { type: Boolean, default: false },
        noLink: { type: Boolean, default: false },
        isPast: { type: Boolean, default: false },
        constOnly: { type: Boolean, default: false },
        constShort: { type: Boolean, default: false },
        displayIntro: { type: Boolean, default: false },
        constellation: { type: String, default: '' },
    },
    computed: {
        
        constellationData () { return this.$store.getters['constellation/findOne']({ _id: this.constellation }) },
        hasBooked () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'attending') : false },
        hasConfirmed () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'confirmed') : false },
        hasGhosted () { return this.user ? this.users.find(u => u._id == this.user._id && u.status == 'ghosted') : false },
        defaultLink () {
            return this.constellationData ? this.localePath({ name: 'c-slug-events-eventId', params: { eventId: this.id, slug: this.constellationData.slug } }) : ''
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias && this.cover.medias.find(m => m.size == 's')
            return thumbnail ? thumbnail.src : ''
        },
        attending () {
            return this.users.filter(u => u.status == 'attending' || u.status == 'confirmed').map(u => this.$getUser(u._id)).filter(u => u)
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
            } else if (!this.max) {
                tagline = ''
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
    position: relative;

    &:hover {
    
    }
}

.BlockGathering_link {
    display: block;
    @include absolute-fill;
    z-index: 6;
}

.BlockGathering_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.25;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockGathering_actions {
    position: absolute;
    z-index: 7;
    top: 0;
    right: 0;
    padding: 15px;
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

.BlockGathering_status {
    flex-shrink: 0;
    font: var(--ft-s-bold);
}

.BlockGathering_title {
    font: var(--ft-title-xs);
    transition: all 150ms ease; 
}

.BlockGathering_details {
    margin-bottom: 5px;
    font: var(--ft-s-medium);
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
            @include ratio(130);
        }
    }

    .BlockGathering_location {
        display: none;
    }

    .BlockGathering_details {
        font: var(--ft-xs-medium);
    }

    .BlockGathering_title {
        font: var(--ft-title-xs);
    }
}

@include breakpoint-xs {

    .BlockGathering_content {
        padding: 15px;
    }
        
    .BlockGathering_cover {
        
        &::before {
            @include ratio(70);
        }
    }

    .BlockGathering_location {
        display: none;
    }

    .BlockGathering_header {
        display: block;
    }

    .BlockGathering_status {
        margin-top: 15px;
    }
}

</style>