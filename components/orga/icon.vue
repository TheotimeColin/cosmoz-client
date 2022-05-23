<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'o-slug', params: { slug }})" class="OrgaIcon" :class="[ ...$modifiers ]" >
        <div class="OrgaIcon_image" :style="{ backgroundImage: src ? `url(${src})` : '' }"></div>

        <!-- <link-base :invert="true" class="OrgaIcon_name" v-if="displayName">{{ name ? name : '' }}</link-base> -->
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'OrgaIcon',
    mixins: [ ModifiersMixin ],
    props: {
        slug: { type: String },
        name: { type: String },
        displayName: { type: Boolean, default: false },
        logo: { type: Object },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({

    }),
    computed: {
        src ()  {
            let src = this.logo ? this.logo.medias.find(m => m.size == 's') : null

            return src && src.src ? src.src : false
        }
    },
}
</script>

<style lang="scss" scoped>
.OrgaIcon {
    display: inline-flex;
    align-items: center;
    vertical-align: top;
}

.OrgaIcon_image {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    font: var(--ft-title-xs);
    text-transform: lowercase;
    background-color: var(--color-bg-xweak);
    color: var(--color-ft-light);
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
}

.OrgaIcon_name {
    font: var(--ft-title-2xs);
    font-size: 15px;
    margin-left: 10px;
}

.OrgaIcon--xs {

    .OrgaIcon_image {
        width: 20px;
        height: 20px;
        font-size: 14px;
    }
}

.OrgaIcon--m {

    .OrgaIcon_image {
        width: 45px;
        height: 45px;
        font-size: 18px;
    }
}

.OrgaIcon--l {

    .OrgaIcon_image {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}

.OrgaIcon--xl {

    .OrgaIcon_image {
        width: 65px;
        height: 65px;
        font-size: 40px;
    }
}

.OrgaIcon--2xl {

    .OrgaIcon_image {
        width: 125px;
        height: 125px;
        font-size: 60px;
    }
}
</style>