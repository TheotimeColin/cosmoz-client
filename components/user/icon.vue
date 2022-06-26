<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'p-userId', params: { userId: id }})" class="UserIcon" :class="[ theme, ...$modifiers, { 'is-friend': isFriend } ]">
        <div class="UserIcon_image" :style="{ backgroundImage: `url(${src ? src : $bg.holo})` }">
            <template v-if="hidePicture || !src">
                {{ name ? name.slice(0, 1) : 'a' }}
            </template>
        </div>

        <div class="UserIcon_nameContainer" v-if="displayName">
            <div class="d-flex fxa-center">
                <component :is="noLink ? 'div' : 'link-base'" :invert="true" class="UserIcon_name">
                    {{ name ? name : '' }}
                </component>

                <slot name="name"></slot>
            </div>

            <slot></slot>
        </div>

        <slot name="overlay"></slot>

        <div class="UserIcon_overlay" v-if="icon">
            <fa :icon="`far fa-${icon}`"></fa>
        </div>

        <div class="UserIcon_badge" v-if="badge">
            <fa :icon="`far fa-${badge}`"></fa>
        </div>
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
        icon: { type: String },
        badge: { type: String },
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
    position: relative;
}

.UserIcon_nameContainer {
    margin-left: 10px;
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
    flex-shrink: 0;
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

.UserIcon_overlay {
    font-size: 20px;
    border-radius: 50%;
    @include absolute-fill;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: color-opacity('bg-2xstrong', -50%);
    transition: all 100ms ease;
    cursor: pointer;
    
    &:hover {
        background-color: color-opacity('bg-2xstrong', -10%);
    }
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
    background-color: var(--color-bg-light);
    cursor: pointer;
    transition: all 100ms ease;
    box-shadow: 0 3px 8px 0px color-opacity('bg-2xstrong', -75%);

    &:hover {
        color: var(--color-ft-light);
        background-color: var(--color-cosmoz);
        transform: scale(0.95);
    }
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

.UserIcon--s {

    .UserIcon_image {
        width: 30px;
        height: 30px;
        font-size: 14px;
    }

    .UserIcon_name {
        font-size: 14px;
    }

    .UserIcon_badge {
        display: none;
    }

    .UserIcon_nameContainer {
        margin-left: 8px;
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

    .UserIcon_badge {
        width: 40px;
        height: 40px;
        font-size: 12px;
    }
}
</style>