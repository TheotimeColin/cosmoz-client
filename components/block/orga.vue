<template>
    <nuxt-link :to="link ? link : defaultLink" class="BlockOrga" :class="[ ...$modifiers ]">
        <div class="BlockOrga_cover">
            <div class="BlockOrga_coverImage" :style="{ backgroundImage: `url(${thumbnail})` }"></div>

            <div class="BlockOrga_header">
                <div class="BlockOrga_logo" :style="{ backgroundImage: logoSmall ? `url(${logoSmall})` : '' }"></div>

                <div>
                    <h3 class="BlockOrga_name">
                        {{ name|specials }}
                    </h3>
                </div>
            </div>
        </div>
        <div class="BlockOrga_content">
            <div class="fx-center mb-10">
                <div class="BlockOrga_location">
                    <fa icon="far fa-map-marker-alt" class="mr-3"></fa> {{ location }}
                </div>
                <div class="ft-xs" v-if="followers > 0">
                    <fa icon="far fa-user-check" class="mr-3"></fa> {{ followers }} abonnés
                </div>
            </div>

            "{{ intro|specials }}"
        </div>
    </nuxt-link>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'BlockOrga',
    mixins: [ ModifiersMixin ],
    props: {
        slug: { type: String },
        name: { type: String },
        intro: { type: String },
        logoSmall: { type: String },
        location: { type: String },
        followers: { type: Number, default: 0 },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false }
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        defaultLink () {
            return this.localePath({ name: 'o-slug', params: { slug: this.slug } })
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias && this.cover.medias.find(m => m.size == 's')
            
            return thumbnail ? thumbnail.src : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockOrga {
    display: block;
    border-radius: 10px;
    overflow: hidden;

    &:hover {
    
    }
}

.BlockOrga_coverImage {
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

.BlockOrga_logo {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin-right: 15px;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
}

.BlockOrga_favs {
    cursor: pointer;
}

.BlockOrga_cover {
    display: block;
    // border-radius: 8px;
    overflow: hidden;
    font: var(--ft-name-l);
    line-height: 1;
    background-color: var(--color-black);
    text-align: left;
    position: relative;
    
    &::before {
        @include ratio(25);
    }
}

.BlockOrga_header {
    padding: 15px;
    z-index: 5;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;
}

.BlockOrga_name {
    font: var(--ft-title-xs);
}

.BlockOrga_location {
    font: var(--ft-xs);
    color: var(--color-ft-weak);
}

.BlockOrga_content {
    font: var(--ft-m);
    line-height: 1.3;
    min-height: 105px;
    color: var(--color-ft-light);
    padding: 15px;
    background-color: var(--color-bg);
}

@include breakpoint-xs {
   
}

</style>