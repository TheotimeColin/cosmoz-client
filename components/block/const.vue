<template>
    <nuxt-link :to="link ? link : defaultLink" class="BlockConst" :class="[ ...$modifiers ]">
        <div class="BlockConst_cover">
            <div class="BlockConst_coverImage" :style="{ backgroundImage: `url(${thumbnail ? thumbnail : $bg.night})` }"></div>
        </div>
        <div class="BlockConst_content">
            <div>
                <const-icon :logo="logo" :name="name" :no-link="true" :display-name="true" />

                <div class="mt-10">
                    <p class="BlockConst_intro ellipsis-2">{{ intro|specials }}</p>
                </div>
            </div>

            <div class="fx-center mt-15">
                <div class="BlockConst_location ellipsis-1 ellipsis-break mr-10">
                    <fa icon="far fa-map-marker-alt" class="mr-3" v-if="location" />{{ location }}
                </div>
                <div class="ft-xs ellipsis-1 ellipsis-break" v-if="members.length > 0">
                    <fa icon="far fa-user-check" class="mr-3"></fa> {{ members.length }} membres
                </div>
            </div>
        </div>
    </nuxt-link>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'BlockConst',
    mixins: [ ModifiersMixin ],
    props: {
        slug: { type: String },
        name: { type: String },
        intro: { type: String },
        logo: { type: Object },
        logoSmall: { type: String },
        location: { type: String },
        members: { type: Array, default: () => [] },
        cover: { type: Object, default: () => ({}) },
        link: { type: [Object, Boolean], default: false }
    },
    data: () => ({

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        defaultLink () {
            return this.localePath({ name: 'c-slug', params: { slug: this.slug } })
        },
        thumbnail () {
            let thumbnail = this.cover && this.cover.medias && this.cover.medias.find(m => m.size == 's')
            
            return thumbnail ? thumbnail.src : ''
        }
    }
}
</script>

<style lang="scss" scoped>
.BlockConst {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    @include shadow-s;
}

.BlockConst_coverImage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 1;
    background-size: cover;
    background-position: center;
    transition: all 150ms ease;
}

.BlockConst_logo {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    margin-right: 15px;
    background-size: cover;
    background-position: center;
    border-radius: 50%;
    position: relative;
    z-index: 5;
}

.BlockConst_favs {
    cursor: pointer;
}

.BlockConst_cover {
    display: flex;
    align-items: center;
    overflow: hidden;
    font: var(--ft-name-l);
    line-height: 1;
    background-color: var(--color-black);
    text-align: left;
    position: relative;
    padding: 15px;

    &::before {
        content: "";
        @include ratio(20);
    }
}

.BlockConst_name {
    font: var(--ft-title-2xs);
    margin-bottom: 10px;
}

.BlockConst_intro {
    min-height: 42px;
}

.BlockConst_location {
    font: var(--ft-xs);
    color: var(--color-ft-weak);
}

.BlockConst_content {
    font: var(--ft-m);
    flex-grow: 1;
    line-height: 1.3;
    color: var(--color-ft-light);
    padding: 15px;
    background-color: var(--color-bg-weak);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

@include breakpoint-xs {
   
}

</style>