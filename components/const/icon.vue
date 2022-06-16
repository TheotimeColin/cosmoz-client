<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath(link ? link : { name: 'c-slug', params: { slug }})" class="ConstIcon" :class="[ ...$modifiers ]" >
        <div class="ConstIcon_image fx-no-shrink" :style="{ backgroundImage: src ? `url(${src})` : '' }">
            <p v-if="!logo">{{ name ? name.slice(0, 1) : '' }}</p>
        </div>

        <link-base :invert="true" class="ConstIcon_name ellipsis-1" v-if="displayName">{{ name ? name : '' }}</link-base>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'ConstIcon',
    mixins: [ ModifiersMixin ],
    props: {
        slug: { type: String },
        name: { type: String },
        displayName: { type: Boolean, default: false },
        logo: { type: Object },
        noLink: { type: Boolean, default: false },
        link: { type: [String, Boolean], default: false },
    },
    data: () => ({

    }),
    computed: {
        src ()  {
            let src = this.logo ? this.logo.medias.find(m => m.size == 's') : null

            return src && src.src ? src.src : this.$bg.holo
        }
    },
}
</script>

<style lang="scss" scoped>
.ConstIcon {
    display: inline-flex;
    align-items: center;
    vertical-align: top;
}

.ConstIcon_image {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font: var(--ft-title-m);
    text-transform: lowercase;
    background-color: var(--color-bg-xweak);
    color: var(--color-ft);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
}

.ConstIcon_name {
    font: var(--ft-title-2xs);
    font-size: 15px;
    margin-left: 10px;
}

.ConstIcon--xs {

    .ConstIcon_image {
        width: 20px;
        height: 20px;
        font-size: 14px;
    }
}

.ConstIcon--s {

    .ConstIcon_image {
        width: 30px;
        height: 30px;
        font-size: 14px;
    }
}

.ConstIcon--m {

    .ConstIcon_image {
        width: 45px;
        height: 45px;
        font-size: 22px;
    }
}

.ConstIcon--l {

    .ConstIcon_image {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}

.ConstIcon--xl {

    .ConstIcon_image {
        width: 65px;
        height: 65px;
        font-size: 40px;
    }
}

.ConstIcon--2xl {

    .ConstIcon_image {
        width: 125px;
        height: 125px;
        font-size: 60px;
    }
}
</style>