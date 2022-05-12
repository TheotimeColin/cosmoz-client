<template>
    <component :is="noLink ? 'div' : 'nuxt-link'" :to="localePath({ name: 'p-id', params: { id: _id }})" class="UserIcon" :class="[ theme, ...$modifiers, { 'is-affinity': isAffinity } ]" :style="src ? { backgroundImage: `url(${src})` } : {}">
        <template v-if="hidePicture || !src">
            {{ name.slice(0, 1) }}
        </template>

        <div class="UserIcon_badge" v-if="isAffinity">
            <i class="fal fa-sparkles"></i>
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
        name: { type: String },
        hidePicture: { type: Boolean, default: false },
        profileLarge: { type: String },
        pictureSrc: { type: String },
        isAffinity: { type: Boolean, default: false },
        noLink: { type: Boolean, default: false }
    },
    data: () => ({
        theme: 'is-cream'
    }),
    computed: {
        src ()  {
            return this.hidePicture ? false : (this.pictureSrc ? this.pictureSrc : this.profileLarge)
        }
    },
    created () {
        this.theme = 'is-' + this.$randomColor()
    }
}
</script>

<style lang="scss" scoped>
.UserIcon {
    width: 35px;
    height: 35px;
    display: inline-flex;
    vertical-align: top;
    align-items: center;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    font: var(--ft-title-s);
    text-transform: lowercase;
    background-color: var(--color-current-weak);
    color: var(--color-current-strong);
    background-size: cover;
    background-position: center;
    position: relative;
}

.UserIcon_badge {
    position: absolute;
    width: 10px;
    height: 10px;
    bottom: 0;
    right: 0;
    border-radius: 50%;
    font-size: 0;
    color: var(--color-ft-light);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-sticky);
}

.UserIcon--m {
    width: 45px;
    height: 45px;
    font-size: 18px;

    .UserIcon_badge {
        width: 20px;
        height: 20px;
        font-size: 10px;
    }
}

.UserIcon--l {
    width: 50px;
    height: 50px;
    font-size: 20px;

    .UserIcon_badge {
        width: 20px;
        height: 20px;
        font-size: 10px;
    }
}

.UserIcon--xl {
    width: 75px;
    height: 75px;
    font-size: 40px;

    .UserIcon_badge {
        width: 24px;
        height: 24px;
        font-size: 12px;
    }
}

.UserIcon--2xl {
    width: 125px;
    height: 125px;
    font-size: 60px;
}
</style>