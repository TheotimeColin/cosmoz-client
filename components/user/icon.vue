<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'p-id', params: { id }})" class="UserIcon" :class="[ theme, ...$modifiers, { 'is-friend': isFriend } ]" >
        <div class="UserIcon_image" :style="{ backgroundImage: `url(${src ? src : $bg.night})` }">
            <template v-if="hidePicture || !src">
                {{ name ? name.slice(0, 1) : 'a' }}
            </template>
        </div>

        <div class="ml-10" v-if="displayName">
            <div class="d-flex fxa-center">
                <component :is="noLink ? 'div' : 'link-base'" :invert="true" class="UserIcon_name">
                    {{ name ? name : '' }}
                </component>
                
                <slot name="name"></slot>
            </div>
            
            <slot></slot>
        </div>

        <slot name="overlay"></slot>
    </component>
</template>

<script>
import { ModifiersMixin } from 'instant-coffee-core'

export default {
    name: 'UserIcon',
    mixins: [ ModifiersMixin ],
    props: {
        _id: { type: String },
        id: { type: String },
        name: { type: String },
        displayName: { type: Boolean, default: false },
        hidePicture: { type: Boolean, default: false },
        profileLarge: { type: String },
        pictureSrc: { type: String },
        isFriend: { type: Boolean, default: false },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({
        theme: 'is-cream'
    }),
    computed: {
        src ()  {
            return this.hidePicture ? this.$bg.night : (this.pictureSrc ? this.pictureSrc : this.profileLarge)
        }
    },
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserIcon {
    display: inline-flex;
    align-items: center;
    vertical-align: top;
}

.UserIcon_image {
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

.UserIcon_name {
    font: var(--ft-title-2xs);
    line-height: 1;
    font-size: 15px;
}

.UserIcon_badge {
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: 0;
    right: 0;
    border-radius: 50%;
    font-size: 0;
    color: var(--color-ft);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;
    background-color: var(--color-sticky);
}

.UserIcon--xs {

    .UserIcon_image {
        width: 20px;
        height: 20px;
        font-size: 14px;
    }

    .UserIcon_badge {
        display: none;
    }
}

.UserIcon--m {

    .UserIcon_image {
        width: 45px;
        height: 45px;
        font-size: 18px;
    }

    .UserIcon_badge {
        width: 20px;
        height: 20px;
        font-size: 10px;
    }
}

.UserIcon--l {

    .UserIcon_image {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }

    .UserIcon_badge {
        width: 20px;
        height: 20px;
        font-size: 10px;
    }

    .UserIcon_name {
        font: var(--ft-title-xs);
    }
}

.UserIcon--xl {

    .UserIcon_image {
        width: 75px;
        height: 75px;
        font-size: 40px;
    }

    .UserIcon_badge {
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
}

.UserIcon--2xl {

    .UserIcon_image {
        width: 125px;
        height: 125px;
        font-size: 60px;
    }
}
</style>